---
title: Longest Palindromic Substring
description: Using python implement Brute Force, Dynamic Programming and Expand Around Center solution to solve the Longest Palindromic Substring problem.
tags: Algorithm, English, Python
image: https://cdn.stocksnap.io/img-thumbs/960w/AOGJEO6SXB.jpg
---
# Longest Palindromic Substring

Using python implement Brute Force, Dynamic Programming and Expand Around Center solution to solve the Longest Palindromic Substring problem.

# Problem

Given s string `s`, find the longest palindromic substring in `s`, You may assume that the maximum length of `s` is 1000.

### Example1:
```python
Input: "babad"
Output: "bab"
Note: "aba" is also a valid answer.
```
### Example2:
```python
Input: "cbbd"
Output: "bb"
```

# The Brute Force
Use two loop to pick up all possible of substring, then verify every substring if it is a palindrome.

Python code will be like
```python
def brute_force_palindrome_substring(string):
    max_string = ""
    for i in range(len(string)):
        for j in range(i, len(string)):
            if string[i: j+1] == string[i: j+1][::-1] and len(max_string) < len(string[i: j+1]):
                max_string = string[i: j+1]
    return max_string
```
We use two loop to generate the substring, that will cost $O(n^2)$ time complexity , also verify the sub-string whether is palindrome will cost $O(n)$ time complexity , as finally this solution will cost $O(n^3)$ time complexity.

Space complexity : $O(1)$. Because the extra memory space just base on `max_string`.

# The Dynamic Programming

To improve the Brute force solution, we first think about we can avoid the unnecessary re-computation like `string[i: i+1]` of `string[i: i+2] and string[1] == string[i+1]`. Then we can use the DP to separate our problem into some sub-problem. We define $P(i, j)$ as following:
$P(i, j)= 1$, if $S_i$..$S_j$ is a palindrome
Therefore, the problem $P(i, j)$ is palindrome can be derived from $P(i+1, j-1)$ and $S_i$==$S_j$ is true.

Finally in the bottom of the base cases are:
$P(i, i) = 1$, $P(i, i+1)= 1$, and $S_i$==$S_{i+1}$

Then our python code can be like:
```python
def dp_longest_palindrome(s):
    ans = ''
    max_len = 0
    n = len(s)
    memo = [[0] * n for _ in range(n)]
    for i in range(n):
        memo[i][i] = 1
        max_len = 1
        ans = s[i]
    for i in range(n-1):
        if s[i] == s[i+1]:
            memo[i][i+1] = 1
            ans = s[i:i+2]
            max_len = 2
    for j in range(n):
        for i in range(0, j-1):
            if s[i] == s[j] and memo[i+1][j-1]:
                memo[i][j] = 1
                if max_len < j - i + 1:
                    ans = s[i:j+1]
                    max_len = j - i + 1
    return ans
```
Complexity Analysis:
* Time complexity: $O(n^2)$.
* Space complexity: $O(n^2)$. Open a $O(n^2)$ table to memorize the sub palindrome.

# Expand Around Center

In fact, we could solve it in $O(n^2)$ time using only constant space.

We observe that a palindrome mirrors around its center. Therefore, a palindrome can be expanded from its center, and there are only $2n - 1$ such centers.

You might be asking why there are $2n - 1$ but not $n$ centers? The reason is the center of a palindrome can be in between two letters. Such palindromes have even number of letters (such as "abba") and its center are between the two 'b's.

Python code will look like:
```python
def longes_palindrome(self, string):
    """
    :type s: str
    :rtype: str
    """
    if len(string) == 0 or string == string[::-1]:
        return string
    start = 0
    end = 0
    for index in range(len(string)):
        left, right = self.helper(string, index, index)
        if right - left > end - start:
            start = left
            end = right

        left, right = self.helper(string, index, index + 1)
        if right - left > end - start:
            start = left
            end = right
    return string[start: end + 1]

def helper(self, string, left, right):
    """
    Testcase:
        case1 when the palindrome length is even size: helper("addaccc",  1, 2)
        Ouput: (0, 3)
        case2 when the palindrome length is odd size: helper("mabakw", 2, 2)
        Ouput: (1, 3)
    """
    if right > len(string):
        return (0, 0)
    while left >= 0 and right < len(string) and string[left] == string[right]:
        left = left - 1
        right = right + 1
    return (left + 1, right - 1)
```
Complexity Analysis
* Time complexity: $O(n^2)$.
* Space complexity: $O(1)$.