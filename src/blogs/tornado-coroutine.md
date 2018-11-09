---
title: Learning tornado coroutine mechanism through source code
description: This post will focus on the dataflow and mechanism of `tornado` coroutine through debug from the source code.
tags: Python, English, Tornado
image: https://cdn.stocksnap.io/img-thumbs/960w/6FOTSJ06WB.jpg
---
# Learning `tornado` coroutine mechanism through source code

This post will focus on the dataflow and mechanism of `tornado` coroutine through debug from the source code.

# Example code

For understanding the operation principle of `tornado` coroutine, I wrote the following example code:
```python
import random
import time
from tornado import gen
from tornado.ioloop import IOLoop

@gen.coroutine
def get_url(url):
    wait_time = random.randint(1, 4)
    yield gen.sleep(wait_time)
    print('URL {} took {}s to get!'.format(url, wait_time))
    return (url, wait_time)

@gen.coroutine
def outer_coroutine():
    before = time.time()
    coroutines = [get_url(url) for url in ['URL1', 'URL2', 'URL3']]
    result = yield coroutines
    after = time.time()
    print(result)
    print('total time: {} seconds'.format(after - before))

if __name__ == '__main__':
    IOLoop.current().run_sync(outer_coroutine)
```
And the output will be like:
```bash
>>> URL URL1 took 1s to get!
>>> URL URL2 took 2s to get!
>>> URL URL3 took 3s to get!
>>> [('URL1', 1), ('URL2', 2), ('URL3', 3)]
>>> total time: 3.0054771900177 seconds
```
In this example code, use the `run_sync()` method from `IOLoop` to run the coroutine, And try to setup a series of interrupted points in the source code and observe the process running, that to understanding the dataflow of the tornado coroutine.

# The `gen.coroutine` decorator

Before we look inside of the `gen.coroutine` source code, we first need to check the documentation first. And as it said:
>    The "decorator and generator" approach in this module is a
   precursor to native coroutines (using ``async def`` and ``await``)
   which were introduced in Python 3.5. 

Which means the `coroutine` pattern in `tornado` can be write use the **"native coroutine" or "decorated coroutine"** in the Python 3.5. So the example code at above can be also written like:
```python
async def get_url(url):
    wait_time = random.randint(1, 4)
    await gen.sleep(wait_time)
    print('URL {} took {}s to get!'.format(url, wait_time))
    return (url, wait_time)


async def outer_coroutine():
    before = time.time()
    coroutines = [await get_url(url) for url in ['URL1', 'URL2', 'URL3']]
    after = time.time()
    print(coroutines)
    print('total time: {} seconds'.format(after - before))
```
which is compatible to `@gen.coroutine` pattern. Also in the `tornado` documentation, it mentioned the following difference of the two forms of `coroutine` are:
* Native coroutines are generally faster.
* Native coroutines can use `async for` and `async with` statements which make some patterns much simpler.
* Native coroutines do not run at all unless you `await` or `yield` them. Decorated coroutines can start running “in the background” as soon as they are called. Note that for both kinds of coroutines it is important to use `await` or `yield` so that any exceptions have somewhere to go.
* Decorated coroutines have additional integration with the `concurrent.futures` package, allowing the result of `executor.submit` to be yielded directly. For native coroutines, use `IOLoop.run_in_executor` instead.
* Decorated coroutines support some shorthand for waiting on multiple objects by yielding a list or dict. Use `tornado.gen.multi` to do this in native coroutines.
* Decorated coroutines can support integration with other packages including Twisted via a registry of conversion functions. To access this functionality in native coroutines, use `tornado.gen.convert_yielded`.
* Decorated coroutines always return a `Future` object. Native coroutines return an `awaitable` object that is not a `Future`. In Tornado the two are mostly **interchangeable**.

Then we are going inside the `gen.coroutine` source code (Tornado version 5.1.1):
```python
# gen.py
def coroutine(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        # trace back the future tack and create a pending future.
        future = _create_future()
        try:
            result = func(*args, **kwargs)
            # omit the Exception handle.
        else:
            if isinstance(result, Generator):
                # Inline the first iteration of Runner.run.  This lets us
                # avoid the cost of creating a Runner when the coroutine
                # never actually yields, which in turn allows us to
                # use "optional" coroutines in critical path code without
                # performance penalty for the synchronous case.
                try:
                    yielded = next(result)
                    # omit the Exception handle
                else:
                    # Provide strong references to Runner objects as long
                    # as their result future objects also have strong
                    # references (typically from the parent coroutine's
                    # Runner). This keeps the coroutine's Runner alive.
                    # We do this by exploiting the public API
                    # add_done_callback() instead of putting a private
                    # attribute on the Future.
                    # (Github issues #1769, #2229).
                    runner = Runner(result, future, yielded)
                    future.add_done_callback(lambda _: runner)
                yielded = None
                try:
                    return future
                finally:
                    # Subtle memory optimization: if next() raised an exception,
                    # the future's exc_info contains a traceback which
                    # includes this stack frame.  This creates a cycle,
                    # which will be collected at the next full GC but has
                    # been shown to greatly increase memory usage of
                    # benchmarks (relative to the refcount-based scheme
                    # used in the absence of cycles).  We can avoid the
                    # cycle by clearing the local variable after we return it.
                    future = None  # type: ignore
        future_set_result_unless_cancelled(future, result)
        return future
    return wrapper
```
Using the example code to track the data flow, As we use `@gen.coroutine` to decorator our `outer_coroutine()` function, it will pause the execution in the `yield` point, which pass the list of `get_url()` sub-coroutine to the `yielded` value. And add a `Runner` to handle those `yielded` sub-coroutine, which add as the `callback` to the `future` object. Through this `coroutine` decorator, we already can guess that `future` object mission is to the `set_result` after the asynchronous event done and execute the callback function (Here is `Runner()`) to wake the coroutine to run to the next `yield` point. So far this `future` object is very close to our `future` object which design at the before article. But what is the `Runner()`? How it to handle the sub-coroutine without to use the `yield from` statement?

# `Future` object.

In the `Tornado` the `Future` object is an alias for `asyncio.Future` and a compatible implementation for older versions of Python. That's the reason of why we can transform the coroutine between "Native" and "Decorator". And from the [documentation of Future python libs](https://docs.python.org/3/library/asyncio-future.html#asyncio.Future), the `Future` object include the following methods, at here I just pick up the important methods which can help use to analysis the `tornado` coroutine:
* `result()` Return the result of the Future.
```python
    def result(self, timeout=None):
        """If the operation succeeded, return its result.  If it failed,
        re-raise its exception.
    
        This method takes a ``timeout`` argument for compatibility with
        `concurrent.futures.Future` but it is an error to call it
        before the `Future` is done, so the ``timeout`` is never used.
        """
        self._clear_tb_log()
        if self._result is not None:
            return self._result
        if self._exc_info is not None:
            try:
                raise_exc_info(self._exc_info)
            finally:
                self = None
        self._check_done()
        return self._result
```

* `set_result()` call the `self._set_done()` method and set its result.
```python
    def set_result(self, result):
        """Sets the result of a ``Future``.
    
        It is undefined to call any of the ``set`` methods more than once
        on the same object.
        """
        self._result = result
        # Set `_done` attribute to True, Add the callback to the IOLoop 
        self._set_done()

    def _set_done(self):
        self._done = True
        if self._callbacks:
            from tornado.ioloop import IOLoop
            loop = IOLoop.current()
            for cb in self._callbacks:
                loop.add_callback(cb, self)
            self._callbacks = None
```

* done() Return True if the Future is done.

* add_done_callback(callback, *, context=None) Add a callback to be run when the Future is done. The callback is called with the Future object as its only argument.
```python
    def add_done_callback(self, fn):
        """Attaches the given callback to the `Future`.
    
        It will be invoked with the `Future` as its argument when the Future
        has finished running and its result is available.  In Tornado
        consider using `.IOLoop.add_future` instead of calling
        `add_done_callback` directly.
        """
        if self._done:
            from tornado.ioloop import IOLoop
            IOLoop.current().add_callback(fn, self)
        else:
            self._callbacks.append(fn)
```

* And the `future_set_result_unless_cancelled()` is to set the given `value` as the `Future`'s result, if not cancelled.
```python
    def future_set_result_unless_cancelled(future, value):
        """Set the given ``value`` as the `Future`'s result, if not cancelled.
    
        Avoids asyncio.InvalidStateError when calling set_result() on
        a cancelled `asyncio.Future`.
    
        .. versionadded:: 5.0
        """
        if not future.cancelled():
            future.set_result(value)
```

# The entrance of coroutine `run_sync()`

On Python 3, `IOLoop` of `tornado` is a wrapper which around the `asyncio` event loop. Which use to create `event loop` in the current tread, and use `run_sync(func)` method to run function asynchronously, and stop the loop.
```python
# ioloop.py IOLoop
def run_sync(self, func, timeout = None):
        future_cell = [None]  # type: List[Optional[Future]]

        def run():
            try:
                result = func()
                if result is not None:
                    from tornado.gen import convert_yielded
                    result = convert_yielded(result)
            except Exception:
                fut = Future()  # type: Future[Any]
                future_cell[0] = fut
                future_set_exc_info(fut, sys.exc_info())
            else:
                if is_future(result):
                    future_cell[0] = result
                else:
                    fut = Future()
                    future_cell[0] = fut
                    fut.set_result(result)
            assert future_cell[0] is not None
            self.add_future(future_cell[0], lambda future: self.stop())

        self.add_callback(run)
        if timeout is not None:

            def timeout_callback() -> None:
                # If we can cancel the future, do so and wait on it. If not,
                # Just stop the loop and return with the task still pending.
                # (If we neither cancel nor wait for the task, a warning
                # will be logged).
                assert future_cell[0] is not None
                if not future_cell[0].cancel():
                    self.stop()

            timeout_handle = self.add_timeout(self.time() + timeout, timeout_callback)
        self.start()
        if timeout is not None:
            self.remove_timeout(timeout_handle)
        assert future_cell[0] is not None
        if future_cell[0].cancelled() or not future_cell[0].done():
            raise TimeoutError("Operation timed out after %s seconds" % timeout)
        return future_cell[0].result()
```
The `outer_coroutine()` be involved into `run_sync()` is running like the following:

1. Create the `IOLoop` instance through the `IOLoop.current()` method.
2. Pass the `outer_coroutine` function as the parameter to the `run_sync()`.
3. Pass the inner `run` function to `self.add_callback()`, as the given callback on the next I/O loop iteration.
4. Run the `IOLoop()` use the `self.start()`, and start to run the callback inner `run` function. 
5. As `outer_coroutine()` will first execute at `@gen.coroutine` decorator, where make the return as the `List[futures]`, which have be called `add_done_callback(runner)` to add the `runner` as callback.
6. This time as the `result` is return as a `list[futures]` object, it involve `convert_yield()` function, that will covert the `list[futures]` object into a `Future[List]` which can be run multiple asynchronous operations in parallel.

From the `add_future()` source code:
```python
def add_future(self, future, callback):
    """Schedules a callback on the ``IOLoop`` when the given
    `.Future` is finished.
    """
    assert is_future(future)
    callback = stack_context.wrap(callback)
    future_add_done_callback(
        future, lambda future: self.add_callback(callback, future))
```
7. `add_future()` is add a `self.stop()` callback to the `IOLoop` **when** the future has been resolved.

# `Runner` object

`Runner` object in the tornado is work like the `Tasks` class what we created in the before post. At here I just pick up the `run()` method of `Runner` class, which work like the `step()` method in the `Task()`:
```python
# gen.py Runner
def run(self):
    """Starts or resumes the generator, running until it reaches a
    yield point that is not ready.
    """
    if self.running or self.finished:
        return
    try:
        self.running = True
        while True:
            future = self.future
            if future is None:
                raise Exception("No pending future")
            if not future.done():
                return
            self.future = None
            try:
                exc_info = None
                try:
                    value = future.result()
                # omit the Exception handle

                if exc_info is not None:
                    # omit the Exception
                else:
                    yielded = self.gen.send(value)

            except (StopIteration, Return) as e:
                self.finished = True
                self.future = _null_future
                future_set_result_unless_cancelled(
                    self.result_future, _value_from_stopiteration(e)
                )
                self.result_future = None  # type: ignore
                return
            except Exception:
                self.finished = True
                self.future = _null_future
                future_set_exc_info(self.result_future, sys.exc_info())
                self.result_future = None  # type: ignore
                return
            if not self.handle_yield(yielded):
                return
            yielded = None
    finally:
        self.running = False
```
The `run()` function is to continuously execute the `next()` or `send()` operation for the `self.gen`, which be passed through the `Runner()` instance. And it will involve the `self.handle_yield(yielded)` method when the future does not complete. See inside of the `self.handle_yield()`:
```python
def handle_yield(self, yielded):
    try:
        self.future = convert_yielded(yielded)
    except BadYieldError:
        self.future = Future()
        future_set_exc_info(self.future, sys.exc_info())

    if self.future is moment:
        self.io_loop.add_callback(self.run)
        return False
    elif self.future is None:
        raise Exception("no pending future")
    elif not self.future.done():

        def inner(f: Any) -> None:
            # Break a reference cycle to speed GC.
            f = None  # noqa: F841
            self.run()

        self.io_loop.add_future(self.future, inner)
        return False
    return True
```
In the `handle_yield()` method, if the future not done, it will pass the `inner()` function which include the `run()` to the future. And it will make the `IOLoop` run the `inner()` callback when the `future` be resolve. The `Runner()` will run out the `coroutine` and it will resume to the `gen.coroutine` decorator, and run the `set_result` method of the future, which will resolve the future status to `done` and latest the `stop()` will be called after `IOLoop` execute all of the callback. Which the data flow will be like the following.

![alt text](https://github.com/Azrealy/Full-stack-learning/blob/master/python/images/tornado_loop.jpg?raw=true)

# Attached

Reference material.

* [The tornado documentation.](https://www.tornadoweb.org/en/stable/)