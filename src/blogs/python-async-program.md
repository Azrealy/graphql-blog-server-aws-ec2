---
title: Python asynchronous programming
description: This post will explain what asynchronous programming is, why we need to use it, and how asynchronous programming has evolved in python.
tags: Python, English, Asyncio
image: https://cdn.stocksnap.io/img-thumbs/960w/C8RVEQSXKS.jpg
---
# Python asynchronous programming

This post will explain what asynchronous programming is, why we need to use it, and how asynchronous programming has evolved in python.

* `Keywords`: Asynchronous, Non-blocking, concurrency, asyncio, coroutine, event loop, tornado.

# Table of Content:

1. What is the asynchronous programming

2. Why we need to use asynchronous programming

3. The road to asynchronous I/O evolution
    * Synchronous blocking mode
    * Muti-process blocking mode
    * Multi-threads blocking mode
    * Non-blocking mode
    * Non-blocking improvements
4. The road to optimization of asynchronous I/O
   * Coroutine
   * Future
   * Task
   * Event Loop
5. Conclusion
6. Attached

# What is the asynchronous programming.

Through the following concept, explain what the asynchronous programming is. If you already know what's the actually asynchronous programming is, you can skip this part.

## blocking

* The program process will be suspended when it does not get the required computing resources.
* The program is **unable to continue doing something else** while waiting for an operation to complete, saying that the program is blocked on the operation.
* The commom blocking process is like: network I/O blocking, disk I/O blocking, user input blocking, and so on.

For example, when you order a meal, you need waiting for the meal completed and between this period you can not do other something.

## non-blocking

* When the program is waiting for an operation, **itself is not blocked**, and can continue to run other things. Then the program is said to be non-blocking in the operation.

Take a familiar example like above, you order a meal and this time when you waiting for it you can do something your like.

## Synchronization

* In order to accomplish a certain task, different program units need to be **coordinated** by some communication method during execution, and these program units are saids to be executed synchronously.
* In short, **synchronization means order**.

## Asynchronous

* In order to complete a task, there is **no need for coordinating communication** between different program units. and the task can be completed.
* Unrelated program units can be asynchronous.
* In short, **asynchronous means unordered**.

## Concurrency

* Concurrency is when multiply tasks can execute and complete in overlapping time periods. It's doesn't necessarily mean they'll ever both be running at the same instant.

For example, **multitasking on a single-core machine**.

## Parallelism 

* Tasks literally run at the same time. 

For example, **multitasking on multi-core processor**.

## Concept summary

* **Non-blocking** is to improve the efficiency of overall program execution.
* **Asynchronous** is the way to efficiency the non-blocking tasks.
* **Parallelism** is adopted with acceleration multitasking completion with multi-core.
* **Concurrency** is to allow independent subtasks to have the opportunity to executed as soon as possible, but not necessarily to speed up the overall progress.

## Asynchronous programming

* Through multi-process, multi-threads, coroutine, function and method are used as the basic approach of the multitask program, and combine with callback, event loop, and other mechanisms to improve the overall efficiency and concurrent of program is be called `Asynchronous Programming`.

For some cases when we meet a I/O operation like read and write to the database or files, we don't want our program process blocked to waiting for those result return, in that case the `non-blocking` approach is adopted. And sometimes you have to query different user's info in the database, as it is not sequence operation, in that case you can use `asynchronous` approach. But in some case like user want to change his password, here you need get the user info first then change the user password, this is sequence, `synchronous` approach is good choice, and also you want handle different user to change password, that is why you need `non-blocking` you user password change operation.

# Why we need use asynchronous programming.

## Cost problem

If a program can't effectively use a computer resource, it will inevitably require more computer to make up for the calculation demand gap. For example if the server threshold of handling client requests per seconds is 1,000, for the 10,000 expected requests we may need create at least 10 of server instance. But what if one server already can handle 10,000 requests in which can cut nearly 90% cost.

## C10k/C10M problem

[The C10k problem](https://en.wikipedia.org/wiki/C10k_problem) is how to provide a single server with FTP service for 10,000 clients in a 1GHz CPU, 2G memory, and 1gbps network environment. And after 2010, with the development of hardware technology, this problem is extended to C10M, that is, how to use 8 core CPU, 64G memory, maintain 10 million concurrent connections on 10gbps network, or process 1 million per second. connection.

## Solution

The CPU tells use that it is very fast, but the context switching is slow, memory read data is slow, disk addressing is slow and fetching data is slow. In short, everything after leaving the CPU is slow except for level 1 cache. Which make the **I/O become the biggest bottleneck**.

# The road to asynchronous I/O evolution.

This part I will use the case of improving the efficiency of **network I/O** of fetching data from the Internet to introduce the asynchronous programming evolution.

And the mission is download 10 pages from the Internet.

## Synchronous blocking mode

The easiest solution to think of is to download them by order, from setting up a socket connection to sending a network request to reading the response data in sequence.
```python
def blocking_way():
    sock = socket.socket()
    # blocking
    sock.connect((host, port))
    request = 'GET / HTTP/1.0\r\nHost: example.com\r\n\r\n'
    sock.send(request.encode('ascii'))
    response = b''
    chunk = sock.recv(4096)
    while chunk:
        response += chunk
        # blocking
        chunk = sock.recv(4096)
    return response
```
And execute the fetching data by 10 times range. 
```python
def sync_way():
    res = []
    for i in range(10):
        res.append(thread_way())
    return len(res)
```
Result: The blocking way of fetching 10 pages will cost 2.31 seconds.

We know that creating a network connection is not determine by the client, but by the network transportation capability and processing speed of the server. Also we unpredictable to when the response will be received from the server.

As the reasons at above pointed out, the methods `sock.connect()` and `sock.recv()` are blocked by default.

For downloading the 10 pages from the web, it will blocking 20 times for waiting the connection and data receive. We can noticed that the efficiency of this synchronous approach is very slow.

## Improvement: Multi-process

The first solution of improve it is to open 10 identical programs at the some time. Use the multi-cores advantages to make every programs running in a dependent process. The code is like the following:
```python
import futures
def process_way():
    workers = 10
    with futures.ProcessPoolExecutor(workers) as executor:
        process_futures = {executor.submit(blocking_way) for i in range(10)}
    return len([future.result() for future in process_futures])
```
Result: The multi-process way of fetching 10 pages will cost 0.26 seconds.

The improvement is immediately effected. But there are still have some problems. The overall time-consuming has not been reduced to one-tenth of the original one, but which is nearly one-ninth of it, so where does the time spent? The answer is process switching overhead.

The CPU switches from one process to another, it will first to save the old process states to the register, then restore those states from register into the new process. For the CPU, the states switching is wasting time. **When the number of processes is greater than the number of CPU cores, process switching is necessarily required.**

In addition to switching overhead, the multi-process also have the other drawback. If the number of processes is larger, the system will be unstable, and the available memory resources will often be insufficient.

## Improvement: Multi-threads

Since thread is a lighter data structure than a process, and one process can be accommodated by multiple threads, the solution of multi-threads is from here. 
```python
def thread_way():
    workers = 10 
    with futures.ThreadPoolExecutor(workers) as executor:
        thread_futures = {executor.submit(blocking_way) for i in range(10)}
    return len([future.result() for future in thread_futures])
```
Result: The multi-threads way of fetching 10 pages will cost 0.24 seconds.

This result is much close to the one-tenth consuming-time of the original one, and also less consuming-time than the multi-process one. From the result of runtime, multi-threads seems to have solve the problem of large switching overhead. And it can also support a large scale of tasks from hundred to thousands.

However, multi-threads still have some problems, especially in Python. First of all, as the existence of **GIL** (FYI, [introduce what is the python GIL](https://realpython.com/python-gil/)), multi-threads can not take advantage of multi-core CPU. In Python process, **only one thread is allowed to run**. But in our socket fetching data case, the blocking methods `sock.connect()` and `sock.recv()` will release the GIL from current thread, and which will allowed other threads have an opportunity to processing code.

> Tip: `time.sleep` in python is blocking, but in multi-thread programming, `time.sleep` does not block other threads.

On the other hand, all multi-thread have the some problem of scheduling the the priority of execution. What may let us confusing like which thread is running at the next moment.

## Non-blocking mode

Finally, we came to the non-blocking solution. Following I will introduce the most primitive way of non-blocking solution.
```python
def nonblocking_way():
    sock = socket.socket()
    # setup to sock.connect and sock.recv become no blocking method
    sock.setblocking(False)
    try:
        sock.connect(('example.com', 80))
    except BlockingIOError:
        # no blocking sock.connect can also arise Error
        pass
    request = 'GET / HTTP/1.0\r\nHost: example.com\r\n\r\n'
    data = request.encode('ascii')
    # Here we take a while loop to sending data,
    # and the sending will success until the error not arise.
    while True:
        try:
            sock.send(data)
            break
        except OSError:
            pass

    response = b''
    # Same approach like above, take a while loop to receive data,
    # and data will be received completed until error not arise.
    while True:
        try:
            chunk = sock.recv(4096)
            while chunk:
                response += chunk
                chunk = sock.recv(4096)
            break
        except OSError:
            pass

    return response
```
Result: The basic non-blocking way of fetching 10 pages will cost 2.35 seconds.

This approach doesn't improve the data fetching process, and the consuming-time is equivalent to synchronous blocking one and also even a little worse than it.

In this case `sock.connect()` and `sock.recv()` is no longer block in the main program, but it did not take advantage by this free CPU to do other meaningful things, like above comment said the process is try to read and write socket in a while loop. (determine the status of non-stop non-blocking calls whether is ready). And worse more you have to deal with negligible exceptions which is not much readable at all. It is also not possible to process multiple sockets at the same time.

And the fetching is still running in order, so the overall execution time is almost equivalent to synchronous blocking.

## Non-blocking improvements

### epoll

If the OS level can help us to check the **non-blocking while loop** like above. Our application can be free to do other things without to worry about the task waiting and judgement.

Here we introduce the `select` system module. Which **encapsulates the I/O states (like socket.connect or file read/write) into a event** by the OS, such as **readable event** and **writable event**, and allowing application to receive those events notifications. In the application, `select` module role as a **monitoring function** which help to store the **file descriptor** and **callback** function into the register. When the state of file descriptor changes, `select` will call the callback function from register.(FYI, [more example of `select` module](https://pymotw.com/2/select/))

There are some familiar modules exist, like, `epoll`, `poll` or `kqueue` which is doing the same things like `select` does but more efficient. And `epoll` is the ubiquity module at the modern Linux system.

### Callback

The **callback** function help OS to know what to do the next after monitored the **I/O state** has changed.

When the `epoll` application listens to the `socket` state, we have to tell `epoll` that: 

* If the `socket` status changed to a **writable data**, which means the socket connection is established successfully, then call a callback function to send the HTTP request.

* If the `socket` status changed to a **readable data**, which means the socket has received a response, then call a callback function to handle the response.

So using the `epoll` module combined with **callback** function the improved solution of fetching pages can look like following:
```python
import socket
from selectors import DefaultSelector, EVENT_WRITE, EVENT_READ
selector = DefaultSelector()
stopped = False
urls_todo = {'/', '/1', '/2', '/3', '/4', '/5', '/6', '/7', '/8', '/9'}
class Crawler:
    def __init__(self, url):
        self.url = url
        self.sock = None
        self.response = b''

    def fetch(self):
        self.sock = socket.socket()
        try:
            # Set connect to proxy or the target server host.
            self.sock.connect((host, port))
        except BlockingIOError:
            pass
        fn = self.sock.fileno()
        selector.register(fn, EVENT_WRITE, self.connected)

    def connected(self, key, mask):
        selector.unregister(key.fd)
        get = 'GET http://example.com{0} HTTP/1.0\r\nHost: example.com\r\n\r\n'.format(self.url)
        self.sock.send(get.encode('ascii'))
        selector.register(key.fd, EVENT_READ, self.read_response)

    def read_response(self, key, mask):
        global stopped
        chunk = self.sock.recv(4096)
        if chunk:
            self.response += chunk
        else:
            selector.unregister(key.fd)
            urls_todo.remove(self.url)
            if not urls_todo:
                stopped = True
```
The little different from the previous cases is using the relative URL path to download 10 different pages. And compare to the basic non-blocking mode, here we eliminated the **while loop** of checking the connection establish and data receive.

The `selectors` modules are provided by the Python standard library `select`, `poll` and `epoll` what are encapsulated in the underlying. (FYI, [High-level I/O multiplexing module `selectors`](https://docs.python.org/3/library/selectors.html)). And at above we setup the default instance by `DefaultSelector` class.

Then the `fetch()` and `connected()` methods register the callback function with writable event `EVENT_WRITE` and readable event `EVENT_READ`. The blocking operation is given to the OS to wait and notify. However, if we want to fetch 10 different pages, we have to create 10 `Crawler` instance, and 20 events will occur. How `selector` to get the current occurred event ? How to get the corresponding callback function to execute? The answer is **event loop**

### Event Loop

In order to solve the above problem, we can easily come up with the idea of writing a loop, and access the `selector` module, waiting for it to tell us which event is currently happening, and which callback is corresponded. **This loop of waiting for event notifications is called as event loop.**
```python
def loop():
    while not stopped:
        # here is a blocking call when no events to handle.
        events = selector.select()
        for event_key, event_mask in events:
            callback = event_key.data
            callback(event_key, event_mask)
```
In this code snippet of **event loop**, we use the global variables to control it stops. When the `url_todo` list running out, the loop will be stopped.

The important thing is like the comments said, `selector.select()` is a blocking call. What will waiting for the event occurred, as the `sock.connect()` and `sock.recv()` are taking time to change event data, so it will be blocking at the `selector.select()` point for waiting event happen. In the case of fetching one page, the cost time is the same as the blocking approach.

Therefore the `selector` mechanism is designed to solve a large number of concurrent tasks. When there are a large number of non-blocking calls in the system and generate events at any time, the `selector` mechanism can exert its maximum power.

Here create 10 download tasks and start event loops:
```python
for url in urls_todo:
    crawler = Crawler(url)
    crawler.fetch()
loop()
```
Result: The selector way of fetching 10 pages will cost 0.24 seconds. 

In a single-threads with the `event loop` and `callback` to fetch 10 pages has the some time-consuming to compare with the multi-threads. And this is **asynchronous programming**.

The above code is executed asynchronously:

1. Create a `Crawler` instance.
2. Call the `fetch()` method, create a `socket` connection and register a writable event on `selector`.
3. `fetch()` method is no blocking operation inside now, and the method returns immediately.
4. Overlap the above 3 steps to add 10 different download page task to the `selector` register.
5. Start the event loop, enter the first round of loops, it will block at the `selector.select()`.
6. When a download task `EVENT_WRITE` is triggered, the `connected` method is called and executed, which will unregistered the `sock.connect()` operation and register the `sock.send()` operation to the `selector` for event loop to listen the `EVENT_READ` event. Then the first round of event loop ends.
7. From the second round of the event loop on, the event could be tracked as a readable or writable event. If the `EVENT_WRITE` is triggered the execution will be like the above step, callback the `connected` method to register `EVENT_READ` event to the loop. If the `EVENT_READ` is triggered, the method `read_response` will be called and receive the data from the response, remove the url from the `urls_todo`.
8. Event loop will stop when the url in `urls_todo` running out, and all pages have been download.

### Summary

Through the study of this section, we should realize that no matter what programming language are, the **event loop + callback** mode of asynchronous programming can not escape, it may be not use `epoll`, it may be not use a while loop. But we don't see any `callback` function in `tornado`, the reason of that will be introduced at the next section with the protagonist `coroutine`.

# The road to optimization of asynchronous I/O

This section will introduce how the `coroutine` to optimise the asynchronous programming. 

## The pain of callback.

In the production level, the complexity of handle the `event loop + callback` will be increased greatly. Consider the following questions:
* What if the callback function does not work properly?
* What if there many layers should nested inside the callback?
* If there are multiple layers nested, what happens if one of the layer callback fails?
* What if there is a data that needs to be processed by each callback?
...

Behind these issues mentioned above, there also have some **drawbacks** of the callback model programming model:

* Poor readability when there are too many callback layers:
```python
def callback_a():
    def callback_b():
        def callback_c():
            return callback_d()
        return callback_c
    return callback_b
```
* Destroying the code structure.
In the synchronization code, the operation runs from top to bottom.
```python
first_task()
second_task()
```
but in the asynchronous programming, it will be write like:
```python
first_task(second_task(third_task(forth_task(..))))
```
The above is actually a callback hell style. 

* Sharing state management difficulties

In the above **event loop + callback** example, we use the OOP programming style, which help us to store the `sock` object state to `self` when the `Crawler` object instantiated. If not to using the OOP programming style, you need to pass the state to each callback.

As the shortcoming mentioned above, the solution of `coroutine` was born.

## Core issues

Through the previous learning, we have understand the biggest difficulty of **asynchronous programming**:
* When is the asynchronous task completed?
* What do you want the asynchronous callback to do?

We can use the **event loop + callback** to solve this, but that make our application more complex. So how the `tornado` and python build-in library `asynio` avoid the callback and make the asynchronous programming much simpler.

The answer is make the program to know what it have done, what it is doing now, and what it going to do in the future. **In other words, the program has to know the current state, and keep the states between different callbacks.**

So the idea is come up with **tasks must be notified its state to each other, each task has its own status**, that is why the `coroutine` come from, as each `coroutine` have its own state and know what the state come in. So what the way of us to improve the **event loop + callback** asynchronous programming is to create a mechanism that coroutines can notify each other states.

## Coroutine

[Coroutine](https://en.wikipedia.org/wiki/Coroutine) are computer-program components that generalize for non-preemptive multitasking, by allowing multiple entry points for suspending and resuming execution at certain locations.
Example of coroutine:
```python
def coroutine():
    while True:
        receive = yield
        print("Receive: ", receive)

coro = coroutine()
next(coro)
coro.send("hello")
coro.send("world")

"""
Output:
Receive: hello
Receive: world
"""
```
This `coroutine()` is created based by **Generator**, it will suspend at every `yield` point and resuming execution when `send()` method run. If you want to learn more about the `coroutine` in the Python you can look this post, ["A Curious Course on
Coroutines and Concurrency."](http://www.dabeaz.com/coroutines/Coroutines.pdf)

Next, we are going to refactoring the Crawler code.

### Create `Future` Object

Not use the `callback`, how do we know the result of asynchronous calls? That is why we design the `Future` object, it will set the result when asynchronous call is executed.
```python
class Future:
    def __init__(self):
        self.result = None
        self._callbacks = []

    def add_done_callback(self, fn):
        self._callbacks.append(fn)

    def set_result(self, result):
        self.result = result
        for fn in self._callbacks:
            fn(self)
```
In the `Future` object, the `result` attribute will stores the future execution results. The method `set_result()` is use to setup the `result` attribute, and execute the callback function which append from `add_done_callback()` method.

Refactoring our `Crawler` Object use the `Future` Object.
```python
class Crawler:
    def __init__(self, url):
        self.url = url
        self.response = b''

    def fetch(self):
        sock = socket.socket()
        sock.setblocking(False)
        try:
            sock.connect((host, port))
        except BlockingIOError:
            pass
        f = Future()

        def on_connected():
            f.set_result(None)

        selector.register(sock.fileno(), EVENT_WRITE, on_connected)
        yield f
        selector.unregister(sock.fileno())
        get = 'GET example.com{0} HTTP/1.0\r\nHost: example.com\r\n\r\n'.format(self.url)
        sock.send(get.encode('ascii'))

        global stopped
        while True:
            f = Future()

            def on_readable():
                try:
                    f.set_result(sock.recv(1024))
                except SocketError as e:
                    if e.errno != errno.ECONNRESET:
                        raise # Not error we are looking for
                    pass # Handle error here.

                

            selector.register(sock.fileno(), EVENT_READ, on_readable)
            chunk = yield f
            selector.unregister(sock.fileno())
            if chunk:
                self.response += chunk
            else:
                urls_todo.remove(self.url)
                if not urls_todo:
                    stopped = True
                break
```
This time, we have an `yield` expression in `fetch()` method, that makes it be a generator. We know that the generator needs to call `next()` or `send(None)` to start it execution and pause it to the `yield` point. Here we create a pending future, then yield it to pause `fetch()` until the socket is ready. The callback function which register in the `event loop`, use to resolve this future.

### `Task` Object
But when the future resolves, what resumes the generator? We need a coroutine driver. Let us call it "task":
```python
class Task:
    def __init__(self, coroutine):
        self.coroutine = coroutine
        f = Future()
        f.set_result(None)
        self.step(f)

    def step(self, future):
        try:
            next_future = self.coroutine.send(future.result)
        except StopIteration:
            return

        next_future.add_done_callback(self.step)
```
`Task` encapsulate the `coroutine` object, which use to pass the `fetch()` generator method at here, and execute the `step()` method to send the **initial future result None** to the `self.coroutine.send()` function. That will help the `fetch()` method to initial execution first. Once `send()` is done, use the `next_future` to add the `step()` callback function. For trigger the next `step()` method to execute, pass it to `add_done_callback()` method. Then every time the `set_result()` be called in the `fetch()` that will trigger the next `step()` method to execute. That means the `fetch()` will be resumed to next `yield` point until the `step()` catch the `StopIteration` exception. 

### The Event Loop

This time the `event loop` will not more care about the `event_key` and `event_mask` parameters. It have become to a simple event driver which will listen to the event happening and call the callback. 
```python
def loop():
    while not stopped:
        events = selector.select()
        for event_key, event_mask in events:
            callback = event_key.data
            callback()
```
Result: The coroutine way of fetching 10 pages will cost 0.25 seconds. 

From the result, time is very close to the callback way of `selector`. But the `fetch()` code in the `Crawler` is still not readable, and in our `fetch()` method, it will go to make socket connection, send request and receive the response. It is not obey the **[Single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)** which means every `module` or `class` should have responsibility over a single part of the functionality. That why we will try to separate those functionality into different method.

## Factoring Coroutines With `yield from`

### `yield from` from Python 3.4
Now Python 3's has the `yield from` takes the stage. It lets one generator delegate to another.

To see how, let us return to our simple generator example:
```python
def gen_fn():
    result = yield 1
    print('result of yield: {}'.format(result))
    result2 = yield 2
    print('result of 2nd yield: {}'.format(result2))
    return 'done'
```
To call this generator from another generator, delegate to it with `yield from`:
```python
# Generator function:
def caller_fn():
     gen = gen_fn()
     rv = yield from gen
     print('return value of yield-from: {}'
           .format(rv))
```
This time `yield from gen` is the same with `yield subgen for subgen in gen`. The `yield from` statement is a frictionless channel, through which values flow in and out of gen until gen completes. Like the following code:
```python
def gen():
    yield from subgen()

def subgen():
    while True:
        x = yield
        yield x+1

def main():
    g = gen()
    # pause subgen() to the first yield point 
    next(g)
    # look like send value to the gen but is going to subgen
    interval = g.send(1)
    # this will return 2
    print(interval)
    # throw StopIteration to the subgen.
    g.throw(StopIteration)
```

### Refactoring `Crawler` object

Use `yield from` express refactor the `fetch()` get socket connection, send request, read response into different sub-coroutine. We write a `read` coroutine to receive one chunk:
```python
def read(sock):
    f = Future()

    def on_readable():
        f.set_result(sock.recv(4096))

    selector.register(sock.fileno(), EVENT_READ, on_readable)
    chunk = yield f  # Read one chunk.
    selector.unregister(sock.fileno())
    return chunk   
```
We build on read with a `read_all` coroutine that receives a whole message:
```python
def read_all(sock):
    response = []
    # Read whole response.
    chunk = yield from read(sock)
    while chunk:
        response.append(chunk)
        chunk = yield from read(sock)

    return b''.join(response)
```
At this moment, if we get rid of the `yield from` statement, it will look like the conventional functions doing blocking I/O. But in fact, `read` and `read_all` is the coroutines and the `read` is the sub-coroutine of `read_all`. While `read_all` is paused, that means the `read` is pause at the `yield` point, and the `event loop` does other work and awaits other I/O events. `read_all` is resumed with the result of `read` on the next loop tick once its event is ready.

At the stack's root, `fetch` calls `read_all`:
```python
class Crawler:
    def fetch(self):
         # ... connection logic from above, then:
        sock.send(request.encode('ascii'))
        self.response = yield from read_all(sock)
```
When `read` yields a future, the task receives it through the channel of `yield from` statements, precisely as if the future were yielded directly from `fetch`. When the loop resolves a future, the task sends its result into `fetch`, and the value is received by `read`, exactly as if the task were driving `read` directly.

To perfect our coroutine implementation, we try to make things more simple: our code uses `yield` when it waits for a future, but `yield from` when it delegates to a sub-coroutine. It would be more refined if we used `yield from` whenever a coroutine pauses. Then a coroutine need not concern itself with what type of thing it awaits.

Notice: `yield from` can be used to either call `coroutine` or `iterator`.

So we make our Future class iterable by implementing a special method:
```python
# Method on Future class.
def __iter__(self):
    # Tell Task to resume me here.
    yield self
    return self.result
```
The future's `__iter__` method is a coroutine that yields the future itself. Now when we replace code like this:
```python
# f is a Future.
yield f
```
with this:
```python
# f is a Future.
yield from f
```
the outcome is the same. And the whole part of `Crawler()` code will be refactoring like following:
```python
class Crawler:
    def __init__(self, url):
        self.url = url
        self.response = b''

    def fetch(self):
        global stopped
        sock = socket.socket()
        yield from connect(sock, ('example.com', 80))
        get = 'GET {0} HTTP/1.0\r\nHost: example.com\r\n\r\n'.format(self.url)
        sock.send(get.encode('ascii'))
        self.response = yield from read_all(sock)
        urls_todo.remove(self.url)
        if not urls_todo:
            stopped = True

```
and the `connect()` part:
```python
def connect(sock, address):
    f = Future()
    sock.setblocking(False)
    try:
        sock.connect(address)
    except BlockingIOError:
        pass

    def on_connected():
        f.set_result(None)

    selector.register(sock.fileno(), EVENT_WRITE, on_connected)
    yield from f
    selector.unregister(sock.fileno())
```
At here we have already peered into the machinery of generators, and sketched an implementation of **future** and **tasks** which concepts is include in the `asyncio` libs. And we outlined how asyncio attains the best of both worlds: concurrent I/O that is more efficient than **threads and more legible than callbacks**. Of course, the real `asyncio` libs is much more sophisticated than this sketch. The real framework addresses zero-copy I/O, fair scheduling, exception handling, and an abundance of other features.

# Conclusion

Increasingly often, modern programs are I/O-bound instead of CPU-bound. For such programs, Python threads are the worst of both worlds: the GIL prevents them from actually executing computations in parallel, and preemptive switching makes them prone to races. **Async is often the right pattern**. But as callback-based async code grows, it tends to become a missing readability. Coroutines may become a good solution. They factor naturally into subroutines, with sane exception handling and stack traces.

So far, we have learned with what **asynchronous programming is**, how it develops in Python, And from the sketch to understand the dataflow of `asyncio` libs which combine the `future`, `Task`, `coroutine`, `event loop` modules to handle asynchronous programming. Also we have know use `yield from` to make our asynchronous code more like synchronous pattern.  

Through those concepts learning, for the person who want to much deeper learning `asyncio` build-in library, can look this posts ["A guide to asynchronous programming in Python with asyncio"](https://medium.freecodecamp.org/a-guide-to-asynchronous-programming-in-python-with-asyncio-232e2afa44f6)

# Attached

Reference material.

* [A Web Crawler With asyncio Coroutines](http://www.aosabook.org/en/500L/a-web-crawler-with-asyncio-coroutines.html)
