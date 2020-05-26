### Buffer
Buffer用于读取和操作二进制流的机制。在底层通过UintArray实现。

## Buffer创建方式
1.Buffer(len)和new Buffer(len)：创建内存已初始化的buffer
2.传入字符串，数组，Buffer作为参数创建：创建时将传入的参数拷贝到buffer中
3.传入ArrayBuffer和SharedBuffer做为参数创建：创建一个与给定数组buffer共享分配内存的buffer

## Buffer.allocUnsafe 和 Buffer.allocUnsafeSlow
Buffer在初始化时会在内存中分配一个长度为8k的buffer共享内存。当创建buffer时，直接从共享的buffer中分配相应长度的空间，如果剩余空间不够会再创建一个8k的buffer再进行分配。如果需要的buffer长度大于8k则直接调用FastBuffer API创建，不在共享内存上进行buffer分配。Buffer.allocUnsafeSlow 也不会在共享内存中分配buffer。
Buffer.allocUnsafe 可以避免过度创建buffer而导致的频繁垃圾回收。

## Buffer与字符编码
当字符串数据存入Buffer实例或读取时可以指定字符编码：Buffer.from("abc", 'utf-8')

## Buffer与TypedArray
1.Buffer.slice是现有buffer上创建而不拷贝，TypedArray.slice会创建切片
2.通过TypedArray.buffer属性可以创建共享内存的Buffer

## Buffer与迭代器
Buffer实例可以使用 for..of 语法进行迭代

## Buffer 存储位置
Buffer占用的内存不是通过V8分配的，属于堆外内存。

## Buffer存储结果
Buffer存储数据和Array类似，它的元素为两位16进制元素（即0-255）。对于大于255的元素就逐次减去256，如果小于0就逐次增加256。如果是小数就舍弃小数部分保留整数。

## Buffer与内存分配
Buffer在C++层面进行内存申请，JavaScript层面进行内存分配，为了高效的分配内存，node采用了slab动态内存管理机制。一个slab空间可能会被多个Buffer使用，slab上的所有Buffer片段都被回收后整个slab才会被释放。

## Buffer拼接与乱码
当读取文件流使用Buffer拼接字符串时，可能会存在乱码的情况，原因是拼接过程进行了类型转化，中文一般采用三个字节表示，读取过程中可能存在只读取了一个中文的部分字节，转换过程中就会出现转换失败乱码的情况。
```
var fs = require('fs');
var rs = fs.createReadStream('test.md');
var data = '';
rs.on('data', function(chunk) {
    data = data + chunk;
    // data = data.toString() + chunk.toString();
});
rs.on('end', function() {
    console.log(data);
});
```

## Buffer正确的拼接方式
1.拼接过程使用Array进行数据缓存，拼接完成后统一转换成字符串
2.使用setEncoding/string_decoder方法拼接（string_decoder内部会返回字符完整的字节，末尾的字符的不完整字节在下次读取时才返回，所有每次返回的字节数据都能进行正常的编码）