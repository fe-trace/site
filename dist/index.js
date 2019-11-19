(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1:function(e,n){e.exports=React},130:function(e,n,t){"use strict";t.r(n),n.default='<h2 id="loader">loader概述</h2>\n<p>loader 在 webpack 中用来自定义资源的编译方式，其本质上就是一个函数，接收资源文件内容，然后将处理结果返回。</p>\n<h3 id="">定义</h3>\n<pre><code>module.exports = function(content) {\n    return content;\n};\nmodule.exports.pitch = function(remainingRequest, precedingRequest, data) {\n    data.value = xxx;\n};\n</code></pre>\n<h3 id="-1">配置方式</h3>\n<pre><code>{ \n    test: /\\.md$/, \n    loader: [\n        \'loader-A\',\n        \'loader-B\'\n    ]\n}\n</code></pre>\n<h3 id="-2">执行过程</h3>\n<p>通过 loader 字段可以为每种资源文件配置多个编译方式，资源文件内容依次从后向前传入每个 loader 进行处理。如果 loader 声明了 pitch 处理逻辑，在执行 loader 逻辑之前，会先从前往后执行 pitch 逻辑。如果 pitch 逻辑中给出了一个执行结果（return xxx），那么会跳过后面的 loader。</p>\n<pre><code>loader 都配置了 pitch 逻辑\nconfig: [loaderA, loaderB, loaderC]\nexecute: loaderA.pitch -&gt; loaderB.pitch -&gt; loaderC.pitch -&gt; loaderC -&gt; loaderB -&gt; loaderA\n\nloader 都配置了 pitch 逻辑，loaderB.pitch 中给出了执行结果\nconfig: [loaderA, loaderB, loaderC]\nexecute: loaderA.pitch -&gt; loaderB.pitch -&gt; loaderA\n</code></pre>\n<h3 id="-3">自定义实现</h3>\n<p>借助 showdown 实现一个将 markdown 转换为 HTML 的自定义 loader。</p>\n<pre><code>const showdown = require(\'showdown\');\nconst converter = new showdown.Converter({\n    tables: true\n});\nmodule.exports = function(content) {\n    // 借助 showdown 库将 markdown 编译成 HTML\n    const html = converter.makeHtml(content);\n    // 对结果封装成一个 JS 模块\n    const result = “export default \'${html}\'; ”;\n    // 将处理结果返回\n    this.callback(null, result);\n};\n</code></pre>'},131:function(e,n){e.exports=ReactDOM},133:function(e,n,t){},135:function(e,n,t){var a={"./af":3,"./af.js":3,"./ar":4,"./ar-dz":5,"./ar-dz.js":5,"./ar-kw":6,"./ar-kw.js":6,"./ar-ly":7,"./ar-ly.js":7,"./ar-ma":8,"./ar-ma.js":8,"./ar-sa":9,"./ar-sa.js":9,"./ar-tn":10,"./ar-tn.js":10,"./ar.js":4,"./az":11,"./az.js":11,"./be":12,"./be.js":12,"./bg":13,"./bg.js":13,"./bm":14,"./bm.js":14,"./bn":15,"./bn.js":15,"./bo":16,"./bo.js":16,"./br":17,"./br.js":17,"./bs":18,"./bs.js":18,"./ca":19,"./ca.js":19,"./cs":20,"./cs.js":20,"./cv":21,"./cv.js":21,"./cy":22,"./cy.js":22,"./da":23,"./da.js":23,"./de":24,"./de-at":25,"./de-at.js":25,"./de-ch":26,"./de-ch.js":26,"./de.js":24,"./dv":27,"./dv.js":27,"./el":28,"./el.js":28,"./en-SG":29,"./en-SG.js":29,"./en-au":30,"./en-au.js":30,"./en-ca":31,"./en-ca.js":31,"./en-gb":32,"./en-gb.js":32,"./en-ie":33,"./en-ie.js":33,"./en-il":34,"./en-il.js":34,"./en-nz":35,"./en-nz.js":35,"./eo":36,"./eo.js":36,"./es":37,"./es-do":38,"./es-do.js":38,"./es-us":39,"./es-us.js":39,"./es.js":37,"./et":40,"./et.js":40,"./eu":41,"./eu.js":41,"./fa":42,"./fa.js":42,"./fi":43,"./fi.js":43,"./fo":44,"./fo.js":44,"./fr":45,"./fr-ca":46,"./fr-ca.js":46,"./fr-ch":47,"./fr-ch.js":47,"./fr.js":45,"./fy":48,"./fy.js":48,"./ga":49,"./ga.js":49,"./gd":50,"./gd.js":50,"./gl":51,"./gl.js":51,"./gom-latn":52,"./gom-latn.js":52,"./gu":53,"./gu.js":53,"./he":54,"./he.js":54,"./hi":55,"./hi.js":55,"./hr":56,"./hr.js":56,"./hu":57,"./hu.js":57,"./hy-am":58,"./hy-am.js":58,"./id":59,"./id.js":59,"./is":60,"./is.js":60,"./it":61,"./it-ch":62,"./it-ch.js":62,"./it.js":61,"./ja":63,"./ja.js":63,"./jv":64,"./jv.js":64,"./ka":65,"./ka.js":65,"./kk":66,"./kk.js":66,"./km":67,"./km.js":67,"./kn":68,"./kn.js":68,"./ko":69,"./ko.js":69,"./ku":70,"./ku.js":70,"./ky":71,"./ky.js":71,"./lb":72,"./lb.js":72,"./lo":73,"./lo.js":73,"./lt":74,"./lt.js":74,"./lv":75,"./lv.js":75,"./me":76,"./me.js":76,"./mi":77,"./mi.js":77,"./mk":78,"./mk.js":78,"./ml":79,"./ml.js":79,"./mn":80,"./mn.js":80,"./mr":81,"./mr.js":81,"./ms":82,"./ms-my":83,"./ms-my.js":83,"./ms.js":82,"./mt":84,"./mt.js":84,"./my":85,"./my.js":85,"./nb":86,"./nb.js":86,"./ne":87,"./ne.js":87,"./nl":88,"./nl-be":89,"./nl-be.js":89,"./nl.js":88,"./nn":90,"./nn.js":90,"./pa-in":91,"./pa-in.js":91,"./pl":92,"./pl.js":92,"./pt":93,"./pt-br":94,"./pt-br.js":94,"./pt.js":93,"./ro":95,"./ro.js":95,"./ru":96,"./ru.js":96,"./sd":97,"./sd.js":97,"./se":98,"./se.js":98,"./si":99,"./si.js":99,"./sk":100,"./sk.js":100,"./sl":101,"./sl.js":101,"./sq":102,"./sq.js":102,"./sr":103,"./sr-cyrl":104,"./sr-cyrl.js":104,"./sr.js":103,"./ss":105,"./ss.js":105,"./sv":106,"./sv.js":106,"./sw":107,"./sw.js":107,"./ta":108,"./ta.js":108,"./te":109,"./te.js":109,"./tet":110,"./tet.js":110,"./tg":111,"./tg.js":111,"./th":112,"./th.js":112,"./tl-ph":113,"./tl-ph.js":113,"./tlh":114,"./tlh.js":114,"./tr":115,"./tr.js":115,"./tzl":116,"./tzl.js":116,"./tzm":117,"./tzm-latn":118,"./tzm-latn.js":118,"./tzm.js":117,"./ug-cn":119,"./ug-cn.js":119,"./uk":120,"./uk.js":120,"./ur":121,"./ur.js":121,"./uz":122,"./uz-latn":123,"./uz-latn.js":123,"./uz.js":122,"./vi":124,"./vi.js":124,"./x-pseudo":125,"./x-pseudo.js":125,"./yo":126,"./yo.js":126,"./zh-cn":127,"./zh-cn.js":127,"./zh-hk":128,"./zh-hk.js":128,"./zh-tw":129,"./zh-tw.js":129};function s(e){var n=r(e);return t(n)}function r(e){if(!t.o(a,e)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return a[e]}s.keys=function(){return Object.keys(a)},s.resolve=r,e.exports=s,s.id=135},136:function(e,n,t){},140:function(e,n,t){var a={"./linux/bin.md":[142,9,3],"./linux/genkins.md":[143,9,4],"./nodejs/cross-env.md":[144,9,5],"./other/git.md":[145,9,6],"./webpack/img/source-map.png":[146,7,12],"./webpack/loader.md":[130,9],"./webpack/optimization配置.md":[147,9,7],"./webpack/webpack-dev-server.md":[148,9,8],"./webpack/webpack-tapable.md":[149,9,9],"./webpack/webpack模块加载.md":[150,9,10],"./webpack/webpack配置.md":[151,9,11]};function s(e){if(!t.o(a,e))return Promise.resolve().then((function(){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=a[e],s=n[0];return Promise.all(n.slice(2).map(t.e)).then((function(){return t.t(s,n[1])}))}s.keys=function(){return Object.keys(a)},s.id=140,e.exports=s},141:function(e,n,t){"use strict";t.r(n);var a=t(1),s=t.n(a),r=t(131),o=t(2),c=(t(133),t(0)),m=t.n(c),i=(t(136),{category:[{name:"linux"},{name:"nodejs"},{name:"other"},{name:"webpack"}],fileList:[{tag:"nodejs",name:"cross-env.md",createTime:1574168913e3,modifyTime:1574168913e3},{tag:"other",name:"git.md",createTime:1574168913e3,modifyTime:1574168913e3},{tag:"webpack",name:"loader.md",createTime:1573957566e3,modifyTime:1573957566e3},{tag:"webpack",name:"webpack-tapable.md",createTime:1573957566e3,modifyTime:157399203e4},{tag:"linux",name:"bin.md",createTime:1573740405e3,modifyTime:1573740405e3},{tag:"webpack",name:"webpack配置.md",createTime:1573740405e3,modifyTime:1573740405e3},{tag:"webpack",name:"webpack模块加载.md",createTime:1573279654e3,modifyTime:1573658238e3},{tag:"linux",name:"genkins.md",createTime:1573220405e3,modifyTime:1573984763e3},{tag:"webpack",name:"webpack-dev-server.md",createTime:1573138633e3,modifyTime:1573273228e3},{tag:"webpack",name:"optimization配置.md",createTime:1573047857e3,modifyTime:1573051561e3}]});function d(e){var n=Object(o.useHistory)(),t=i.fileList;return s.a.createElement("div",{className:"home-page"},t.map((function(e,t){return s.a.createElement("div",{className:"block",key:t},s.a.createElement("div",{className:"title"},s.a.createElement("a",{onClick:function(){var t,a;t=e.tag,a=e.name,n.push("/".concat(t,"/").concat(a))}},e.name)),s.a.createElement("div",{className:"meta"},m()(e.createTime).format("YYYY-MM-DD HH:mm:ss")))})))}var l=t(132),j=t.n(l);t(130);function u(){var e=Object(o.useParams)(),n=s.a.useState(null),a=j()(n,2),r=a[0],c=a[1];return s.a.useEffect((function(){t(140)("./".concat(e.tag,"/").concat(e.name)).then((function(e){c(e.default)}))})),s.a.createElement("div",{className:"detail-page"},s.a.createElement("div",{dangerouslySetInnerHTML:{__html:r}}))}Object(r.render)(s.a.createElement((function(e){return s.a.createElement("div",null,s.a.createElement("div",{className:"header"}),s.a.createElement("div",{className:"content"},s.a.createElement(o.HashRouter,null,s.a.createElement(o.Switch,null,s.a.createElement(o.Route,{exact:!0,path:"/",component:d}),s.a.createElement(o.Route,{exact:!0,path:"/:tag/:name",component:u})))))}),null),document.body)},2:function(e,n){e.exports=ReactRouterDOM}},[[141,2,1]]]);