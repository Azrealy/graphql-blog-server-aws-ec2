# Deep understanding python asynchronous programming of `tornado`

Thoroughly understand what, why, and how asynchronous programming is. 
And learning the basic concept of `tornado` asynchronous programming.

* `Keywords`: Asynchronous, Non-blocking, concurrency, asyncio, coroutine, event loop, tornado.

# Introduction

This article will include three part of content.

## Part One:

Before we talking about `tornado`, this part will try to introduce the basic concept of python asynchronous programming you should know. Though this part learning, using those concepts to help us understand how `tornado` working at asynchronous programming.

1. Explain what is asynchronous programming is and its closely related concepts such as blocking/non-blocking, synchronous/asynchronous, concurrent/parallel, etc. (Explaining the basic concept which will thorough all of this article.)

2. Why we need to use asynchronous programming. 

3. How to develop from synchronous blocking to asynchronous non-blocking.

4. How does `epoll`, `Callback` and `Event loop` works.

5. How asynchronous programming gradually moves from callbacks to generators to native coroutine.

6. How the lib `asyncio` works in python 3.5.

## Part Two: 

Though the first part of learning, this part will start looking inside of `tornado` package itself.

1. Though demo codes to understand how the function be decorated by `@gen.coroutine` executed involving from `Future`, `Runner` to `IOLoop`.

## Part Three: 
Though some demo codes to introduce some usefull module in `tornado`.

1. Demo code of use `tornado.concurrent`.
2. Demo code of use `tornado.log`.