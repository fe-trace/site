### Buffer
Buffer用于读取和操作二进制流的机制。在底层通过UintArray实现。

## Buffer创建方式
1.Buffer(len)和new Buffer(len)：创建内存已初始化的buffer
2.传入字符串，数组，Buffer作为参数创建：创建时将传入的参数拷贝到buffer中
3.传入ArrayBuffer和SharedBuffer做为参数创建：创建一个与给定数组buffer共享分配内存的buffer

## Buffer.allocUnsafe 和 Buffer.allocUnsafeSlow
Buffer在初始化时会在内存中分配一个长度为8096的buffer共享内存。当创建buffer时，直接从共享的buffer中分配相应长度的空间，如果剩余空间不够会再创建一个8096长度的buffer再进行分配。如果需要的buffer长度大于8096则直接调用FastBuffer API创建，不在共享内存上进行buffer分配。Buffer.allocUnsafeSlow 也不会在共享内存中分配buffer。
Buffer.allocUnsafe 可以避免过度创建buffer而导致的频繁垃圾回收。

## Buffer与字符编码
当字符串数据存入Buffer实例或读取时可以指定字符编码：Buffer.from("abc", 'utf-8')

## Buffer与TypedArray
1.Buffer.slice是现有buffer上创建而不拷贝，TypedArray.slice会创建切片
2.通过TypedArray.buffer属性可以创建共享内存的Buffer

## Buffer与迭代器
Buffer实例可以使用 for..of 语法进行迭代

