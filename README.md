# Reference
https://www.youtube.com/watch?v=2EpX9LkO2T0

https://www.youtube.com/watch?v=c5O7E_PDO4U

https://www.youtube.com/watch?v=EKcQt-74bNw&t=549s

https://www.youtube.com/watch?v=uUatD9AudXo

# Sparse Table
## Limitation with prefix sum
- Operation must be inversible i.e. can be calculated by performing operation on bigger range and smaller range
- It only works with range sum query
- It can't be used to get `max`, `min`, `gcd`, `bitwise and`, `bitwise or` query 
- For example, its not possible to find `max` for `5....10` if ans given range `0....4` and `0....10` 
## Sparse table basics
- If we create small blocks and pre calculate ans for `max`
- Then max of two blocks can give answer for bigger range.
- What should be optimal size of blocks?
![](assets/sparse-table-blocks.png)
- One option is, create blocks of each 2 consecutive blocks
![](assets/sparse-table-2-blocks.png)
This will give time complexity of O(n/2)
- Other option is, create `4`/`8`,`16` etc size of blocks as well
![](assets/sparse-table-multiple-blocks.png)
- How to apply query?
- Get diff of given range `low` and `high` as `m`
- Split given number `m` in power of `2` 
- Max size will be `log m`
- For example `5` = `4` + `1`
![](assets/sparse-table-query.png)
- We need to repeat this for all signed bit
- Time complexity of per query is `O (logm)`
- It works on both `sum`, `max`, `min`, `gcd` etc
## Steps to calculate block
- Assumption is, before making block of size `4`, we must have created block size of `2`
- Ans for block size `4` can be answered by two `2` size blocks
![](assets/sparse-table-compute-blocks.png)
- Total time will be equal to total blocks
![](assets/sparse-table-blocks-count.png)
- Max we can make `logn` blocks
- Total blocks `n * logn` blocks
- Each block takes `1` unit of time to calculate value
- Total time will be `O(n log n)` 
- Space will be same as number of blocks i.e. `O(n logn)`
- Per query time `log n`
## Limitation of sparse table
- Not helpful if input is mutable i.e. updates are performed
## Idempotence operation
- A X A = A
- max(5,5) = 5
- min(5,5) = 5
- gcd(5,5) = 5
- and(1,1) = 1
- or(1,1) = 1
- sum(1,1) != 1
## Optimize Sparse table for Idempotent operation
- Normal calculation
![](assets/sparse-table-normal-query.png)
- Can we get benefit of idempotent operation?
- Get power of `2` closer to `m`
- For example, for given `7` we will chose `4` not `8`
- Jump from 0 to `4` length 
- Jump from end to end - 4 length 
![](assets/sparse-table-optimized-query.png)
- Total operation = 2 jumps ~ O(2)
- Pre processing is still `n logn`
- Per query `O(1)`

## Sparse Table Intitution
- Every positive integer can easily be represented as a sum of power of `2` given by its binary representation
- 19 = (10011)2 = 2^4 + 2^1 + 2^0
- Similarly, any interval [l,r] can be broken down smaller interval power 2
- [5, 17] = [5, 5 + 2^3) +  [13, 13 + 2^2] + (17, 17 + 2^0)
        = [4, 13) + [13, 17) + [17, 18)
- diff = 17 - 5 = 12
- Get one higher len = 13
- 13 in binary = 1101 = 2^3 + 2 ^2 + 2^0
- Now, imagine if we could precompute the range query answer (i.e. max, min, lcm)
## Range Combination function
### Associative functions
- A function `f(x,y)` is associative if 
    f(a, f(b,c)) = f(f(a,b),c) for all a, b, c
- Following operations are associative
    - Addition
    - Multiplication
- Following operations are not associative
    - Subtraction
    - exponentiations
- Sparse table can answer associative range query in O(log n)
### Can we do better than O(log n)
- When the range query combination function is `overlap friendly`, then range query on sparse table can be answered in `O(1)`
- Being overalp friendly means a function yields the same answer regardless of whether it is combining ranges which overlap or those that do not
- We say a binary function `f(x,y)` is overlap friendly if 
    f(f(a,b), f(b,c)) = f(a, f(b,c)) for all valid a, b, c
- Following function is not overlap friendly
    f(x,y) = x + y
- Following are overlap functions
    - max
    - min
    - gcd
    - lcm
## Table construction
- `N` is size of the input
- `2^P` be the largest power of `2` that fits in the length of the value array
- 2^P <= N
- P <= logN
- P = floor(logN)
- N = 13
    - P = floor(log 13)
    - P = 3
- Initialize table with `P + 1` rows and `N` columns
- Fill first rows with input values
- Each cell (i, j) represents the answer for the range [j, j + 2^i) in the original array
- Any range which is outsize of input array will be kept empty that will make table sparsed
### Min sparsed table
![](assets/sparse-table-constructions.png)
- f(x,y) = min (x,y)
- will build table by already computed prev range value
- Each cell (i, j) represents the min answer for the range [j, j + 2^i) in the original array
- Length of range for each cell is always even
- It means we can easily split range into two
- dp[i][j] = f(dp[i-1][j], dp[i-1][j + 2^(i-1)]) 
           = min(dp[i-1][j], dp[i-1][j + 2^(i-1)]) 

![](assets/sparse-table-example.png)
## Range Query
- What is minimum value between [1, 11)?
    - In our table, we have already pre-computed the answer for all intervals of length 2^k
    - k is the largest power of two that fits in the length of range between `[l,r)`
    - Split range `[l,r)` as below
        - left interval: `[l, l +k]`
        - right interval: `[r - k + 1, r`
    - left and right interval may overlap but this doesn't matter given the operlapping property
![](assets/sparse-table-min-range-query.png)
## Associative Function Query
- Do casecading query on the sparse table by breaking the range `[l,r)` into smaller range of `2^x` which do not overlap.
- For example, range `[2,15]` i.e. `15 -2 = 13 ~ 14 = 1110` can be split into three intervals of lengths 
    - 8
    - 4
    - 2
    - [2, 2 + 2^3] + [10, 10 + 2^2] + [14, 14 + 2^1]
### Product function
- Construct Sparse table
![](assets/sparse-table-product.png)
- Product between range `[0,6]
![](assets/sparse-table-product-range-query.png)
- Product between range `[1,5]`
![](assets/sparse-table-product-query-range-2.png)
## Sparse table psuedocode
![](assets/sparse-table-pseudocode.png)
## Sparse table construction code
![](assets/sparse-table-construction-code.png)
## Sparse table range query
![](assets/sparse-table-range-query.png)
## Sparse table to return index
![](assets/sparse-table-range-query-to-return-index.png)
# Sparse Tables and LCA
## Euler Tour of a Tree
![](assets/euler-tour-tree.png)
- Translate tree to array for run query easier
- This is technically not a Euler tour
- This is basically a tree traversal
- We repeat the edge 
- Apply timer everytime you touch node
- We take tree and convert into sequence
- This is called Euler tour tree
![](assets/eular-tour-tree-timer-array.png)
- Create array of size timer
- Map timer to corresponding node
- Also maintain height of each node
- This is `Tree linearization`
![](assets/eular-tree-min-range-query.png)
- Range minimum between two given nodes gives `lca`
    - Use `Segment Tree` to run Range minimum query
    - You can also apply `Sparse Table` to get range minimum query


#  Kth Ancestor of a Tree Node
https://leetcode.com/problems/kth-ancestor-of-a-tree-node/

# Maximum Binary Tree
https://leetcode.com/problems/maximum-binary-tree/

# Find a Value of a Mysterious Function Closest to Target
https://leetcode.com/problems/find-a-value-of-a-mysterious-function-closest-to-target/

# Sliding Window Maximum
https://leetcode.com/problems/sliding-window-maximum/

# XOR Queries of a Subarray
https://leetcode.com/problems/xor-queries-of-a-subarray/

