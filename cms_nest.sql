/*
Navicat MySQL Data Transfer

Source Server         : localhost
Source Server Version : 50726
Source Host           : localhost:3306
Source Database       : cms_nest

Target Server Type    : MYSQL
Target Server Version : 50726
File Encoding         : 65001

Date: 2021-08-07 12:12:56
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for cms_article
-- ----------------------------
DROP TABLE IF EXISTS `cms_article`;
CREATE TABLE `cms_article` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '标题',
  `summary` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '摘要',
  `author` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '作者',
  `source` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '来源',
  `keywords` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '关键字（多个使用逗号“，”分隔）',
  `type` tinyint(4) NOT NULL COMMENT '文章类型（0：文本；1：链接；2：图片；3：组图；4：视频；5：音频）',
  `thumbId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '缩略图',
  `fileId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '附件',
  `contentUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '链接地址',
  `mediaId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '媒体地址',
  `weight` int(11) DEFAULT NULL COMMENT '权重',
  `content` text COLLATE utf8_unicode_ci COMMENT '内容',
  `publicTime` datetime DEFAULT NULL COMMENT '发布时间',
  `publicBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '发布人 id',
  `browseCount` int(11) NOT NULL DEFAULT '0' COMMENT '浏览量',
  `linkCount` int(11) NOT NULL DEFAULT '0' COMMENT '点赞量',
  `collectCount` int(11) NOT NULL DEFAULT '0' COMMENT '收藏量',
  `shareCount` int(11) NOT NULL DEFAULT '0' COMMENT '分享量',
  `isComment` tinyint(4) NOT NULL DEFAULT '1' COMMENT '允许评论',
  `commentCount` int(11) NOT NULL DEFAULT '0' COMMENT '评论量',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cms_article
-- ----------------------------
INSERT INTO `cms_article` VALUES ('16eda59a-2953-453b-aac0-0bba030d57c6', '1', '', '2021-08-07 01:50:50.596936', null, '2021-08-07 01:50:50.596936', null, '0', null, null, '看完还不懂JavaScript执行机制(EventLoop)，你来捶我', '这是我参与8月更文挑战的第6天，活动详情查看：8月更文挑战', null, null, null, '0', '', null, '', '', '0', '<div>\n<p>上一篇文章介绍了进程与线程，知道渲染进程都有一个主线程，并且主线程工作很多，要处理DOM、计算样式、布局、还有鼠标、键盘等各种JS任务</p>\n<p>我们都知道JS是单线程，任务只能一件一件地执行，那么浏览器是怎么让这么多类型的任务在主线程上有条紊地执行的呢？</p>\n<p>这就需要<strong>任务队列</strong>和<strong>事件循环</strong>了</p>\n<h2 data-id=\"heading-0\">任务队列(消息队列)</h2>\n<p>什么是任务队列呢？</p>\n<p>它是一种数据结构，存放要执行的任务。然后事件循环系统再以先进先出原则按顺序执行队列中的任务。产生新任务时IO线程就将任务添加在队列尾部，要执行任务渲染主线程就会循环地从队列头部取出执行，如图</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4b00d4477e9c4bca8d2268c4ceca8a9b~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"未标题-12.jpg\" /></p>\n<p>如果其他进程也有任务想让主线程执行的话，也是一样的通过 IO 线程接收并将任务添加到任务队列就可以了</p>\n<p>可任务队列里的任务类型太多了，而且是多个线程操作同一个任务队列，比如鼠标滚动、点击、移动、输入、计时器、WebSocket、文件读写、解析DOM、计算样式、计算布局、JS执行.....</p>\n<p>这些任务都在主线程中执行，而JS是单线程的，一个任务执行需要等前面的任务都执行完，所以就需要解决单个任务占用主线程过久的问题</p>\n<p>比如如果一个动画任务前面有一个JS任务执行时间很长，那我们看到的就是卡卡的感觉，用户体验就很不好</p>\n<p>如果是DOM频繁发生变化的JS任务，每次变化都需要调用相应的JavaScript接口，无疑会导致任务时间拉长，如果把DOM变化做成异步任务，那可能添加到任务队列过程中，前面又有很多任务在排队了</p>\n<p>所以<code>为了处理高优先级的任务</code>，<code>和解决单任务执行过长的问题</code>，所以需要将任务划分，所以微任务和宏任务它来了</p>\n<p>在说微任务之前，要知道一个概念就是<strong>同步</strong>和<strong>异步</strong></p>\n<h2 data-id=\"heading-1\">同步和异步</h2>\n<p>我们知道了浏览器页面是由任务队列和事件循环系统来驱动的，但是队列要一个一个执行，如果某个任务(http请求)是个耗时任务，那浏览器总不能一直卡着，所以为了防止主线程阻塞，JavaScript 又分为同步任务和异步任务</p>\n<p><code>同步任务</code>：就是任务一个一个执行，如果某个任务执行时间过长，后面的就只能一直等下去</p>\n<p><code>异步任务</code>：就是进程在执行某个任务时，该任务需要等一段时间才能返回，这时候就把这个任务放到专门处理异步任务的模块，然后继续往下执行，不会因为这个任务而阻塞</p>\n<p><strong>也就是说，除了任务队列，还有一个专门处理需要延迟执行的模块(延迟哈希表)</strong></p>\n<p><strong>常见的异步任务</strong>：定时器、ajax、事件绑定、回调函数、async await、promise</p>\n<p>好了，我们再来说微任务吧</p>\n<h2 data-id=\"heading-2\">微任务和宏任务</h2>\n<p>JS执行时，V8会创建一个全局执行上下文，在创建上下文的同时，<strong>V8也会在内部创建一个微任务队列</strong></p>\n<p><strong>有微任务队列，自然就有宏任务队列，任务队列中的每一个任务则都称为宏任务，在当前宏任务执行过程中，如果有新的微任务产生，就添加到微任务队列中</strong></p>\n<ul>\n<li><code>微任务包括</code>： promise回调、proxy、MutationObserver(监听DOM)、node 中的 process.nextTick等</li>\n<li><code>宏任务包括</code>： 渲染事件、请求、script、setTimeout、setInterval、Node中的setImmediate、I/O 等</li>\n</ul>\n<p><strong>来看栗子搞懂她</strong></p>\n<p>你和一个大爷在银行办业务，大爷排在你前面，大爷是要存钱，存完钱之后，工作人员问大爷还要不要办理其他业务，大爷说那我再改个密码吧，这时候总不能让大爷到队伍最后去排队再来改密码吧</p>\n<p>这里面大爷要办业务就是一个宏任务，而在钱存完了又想改密码，这就产生了一个微任务，大爷还想办其他业务就又产生新微任务，直到所有微任务执行完，队伍的下一个人再来</p>\n<p>这个队伍就是任务队列，工作人员就是单线程的JS引擎，排队的人只能一个一个来让他给你办事</p>\n<p>也就是说<code>当前宏任务里的微任务全部执行完，才会执行下一个宏任务</code></p>\n<p><strong>用代码来举例</strong></p>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\">&lt;script&gt; <span class=\"hljs-comment\">// 宏任务</span>\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">1</span>)\n    <span class=\"hljs-built_in\">setTimeout</span>(<span class=\"hljs-function\">()=&gt;</span>{ <span class=\"hljs-comment\">// 宏任务</span>\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">2</span>)\n    },<span class=\"hljs-number\">0</span>)\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">3</span>)\n&lt;/script&gt;\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<p>输出结果就是 <code>1  3  2</code> ，因为setTimeout是宏任务，哪怕它的时间为0，当前宏任务里的任务没执行完，她插队也没用。然后就算计时时间为0，它也是一个延迟任务，所以放到异步处理模块去先</p>\n<p><strong>注意</strong>：异步处理模块(延迟哈希表)是一个和任务队列同等级的数据结构。每个宏任务结束后，主线程就会检查延迟哈希表，将里面到期的任务拿出来依次执行，比如回调/计时器达到触发条件等。不明白的话下面有图，看着就很清晰了</p>\n<p><strong>再来</strong></p>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\">&lt;script&gt; <span class=\"hljs-comment\">// 宏任务</span>\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">1</span>)\n    <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">Promise</span>( <span class=\"hljs-function\"><span class=\"hljs-params\">resolve</span> =&gt;</span> {\n        resolve(<span class=\"hljs-number\">2</span>) <span class=\"hljs-comment\">// 回调 是微任务</span>\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">3</span>)\n    }).then( <span class=\"hljs-function\"><span class=\"hljs-params\">num</span> =&gt;</span> {\n        <span class=\"hljs-built_in\">console</span>.log(num)\n    })\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">4</span>)\n&lt;/script&gt;\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<p>输出结果就是 <code>1 3 4 2</code> ，遇到微任务(这里的回调)就放到微任务队列里，等着执行栈中的任务执行完，再拿出来执行</p>\n<p><strong>看图，必须要搞懂她</strong></p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25681734818441f7a16ea6cdc0e0bbc3~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"367e4062e66b2c2512768749e533393.jpg\" /></p>\n<p>没理解的话可以多看一会儿这个图，这一块儿也是面试很爱问的</p>\n<p>如图可以看出来执行过程形成了一个循环，这就是<strong>事件循环( EventLoop )</strong></p>\n<h2 data-id=\"heading-3\">事件循环( <code>EventLoop</code> )</h2>\n<p>事件循环：一句话概括就是入栈到出栈的循环</p>\n<p>即：一个宏任务，所有微任务，渲染，一个宏任务，所有微任务，渲染.....</p>\n<p><strong>循环过程</strong>：</p>\n<ol>\n<li>\n<p>所有同步任务都在主线程上依次执行，形成一个执行栈(调用栈)，异步任务处理完后则放入一个任务队列</p>\n</li>\n<li>\n<p>当执行栈中任务执行完，再去检查微任务队列里的微任务是否为空，有就执行，如果执行微任务过程中又遇到微任务，就添加到微任务队列末尾继续执行，把微任务全部执行完</p>\n</li>\n<li>\n<p>微任务执行完后，再到任务队列检查宏任务是否为空，有就取出最先进入队列的宏任务压入执行栈中执行其同步代码</p>\n</li>\n<li>\n<p>然后回到第2步执行该宏任务中的微任务，如此反复，直到宏任务也执行完，如此循环</p>\n</li>\n</ol>\n<h2 data-id=\"heading-4\">练习一下，彻底搞懂她</h2>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\">&lt;script&gt;\n    <span class=\"hljs-built_in\">setTimeout</span>(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> () </span>{\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'setTimeout\'</span>)\n    }, <span class=\"hljs-number\">0</span>)\n    <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">Promise</span>(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> (<span class=\"hljs-params\">resolve</span>) </span>{\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'promise1\'</span>)\n        <span class=\"hljs-keyword\">for</span>( <span class=\"hljs-keyword\">let</span> i = <span class=\"hljs-number\">0</span>; i &lt; <span class=\"hljs-number\">1000</span>; i++ ) {\n            i === <span class=\"hljs-number\">999</span> &amp;&amp; resolve()\n        }\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'promise2\'</span>)\n    }).then(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> ()  </span>{\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'promise3\'</span>)\n    })\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'script\'</span>)\n&lt;/script&gt;\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<p>输出结果：<code>promise1</code> -&gt; <code>promise2</code> -&gt; <code>script</code> -&gt; <code>promise3</code> -&gt; <code>setTimeout</code></p>\n<p><strong>想一下为什么？</strong></p>\n<ul>\n<li>script 是宏任务，先执行它里面的微任务</li>\n<li>遇到宏任务setTimeout放到异步处理模块(延迟哈希表)</li>\n<li>继续执行promise，打印<code>promise1</code></li>\n<li>遇到循环，执行，遇到回调 resolve()，上面说了回调属于微任务，放到微任务队列</li>\n<li>继续执行，打印 <code>promise2</code></li>\n<li>继续执行，打印 <code>script</code></li>\n<li>执行栈的任务执行完了，去微任务列队里拿</li>\n<li>有一个 then 回调，执行，打印 <code>promise3</code></li>\n<li>微任务都执行完了，去任务队列拿下一个宏任务</li>\n<li>执行 setTimeout，打印 <code>setTimeout</code></li>\n</ul>\n<p>没有理解的话，再想想</p>\n<h3 data-id=\"heading-5\">当遇到 async / await 呢？</h3>\n<p><code>async</code>/<code>await</code> 是 ES7 引入的重大改进的地方，<strong>可以在不阻塞主线程的情况下，使用同步代码实现异步访问资源的能力</strong>，让我们的代码逻辑更清晰</p>\n<p>说白了</p>\n<p><code>async</code>：就是异步执行和隐式返回Promise<br /><code>await</code>：返回的就是一个Promise对象</p>\n<p><strong>看题</strong></p>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\"><span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">fun</span>() </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">1</span>)\n    <span class=\"hljs-keyword\">let</span> a = <span class=\"hljs-keyword\">await</span> <span class=\"hljs-number\">2</span>\n    <span class=\"hljs-built_in\">console</span>.log(a)\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">3</span>)\n}\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">4</span>)\nfun()\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">5</span>)\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<p>输出结果：<code>4 1 5 2 3</code></p>\n<p>结合 async / await 的特点，我们来把这个题用 ES6 翻译一下</p>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\"><span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">fun</span>()</span>{\n    <span class=\"hljs-keyword\">return</span> <span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">Promise</span>(<span class=\"hljs-function\">() =&gt;</span> {\n        <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">1</span>)\n        <span class=\"hljs-built_in\">Promise</span>.resolve(<span class=\"hljs-number\">2</span>).then( <span class=\"hljs-function\"><span class=\"hljs-params\">a</span> =&gt;</span> {\n            <span class=\"hljs-built_in\">console</span>.log(a)\n            <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">3</span>)\n        })\n    })\n}\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">4</span>)\nfun()\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">5</span>)\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<p>上面说了，回调是微任务，所以直接扔到微任务队列等着，这题里自然就是最后执行，是不是好理解一点了</p>\n<p><strong>再来</strong></p>\n<p>先别看下面答案，想一下这题，和上面有一点点区别</p>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\"><span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">bar</span> () </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">2</span>)\n}\n<span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">fun</span>() </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">1</span>)\n    <span class=\"hljs-keyword\">await</span> bar()\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">3</span>)\n}\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">4</span>)\nfun()\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-number\">5</span>)\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<p>输出结果：<code>4 1 2 5 3</code></p>\n<p>为啥？上面例子中 2 都没打印出来，为啥这个就出来了</p>\n<p>因为await的意思就是等，等await后面的执行完。所以\"await bar()\"，是从右向左执行，执行完bar()，然后遇到await，返回一个微任务(哪怕这任务里没东西)，放到微任务队列让出主线程。</p>\n<p>上面说了 async/await 就是把异步以同步的形式实现，同步就是一步一步一行一行来嘛，await在微任务队列里都没回来，那在await下面的自然不能执行，导致 3 最后打印</p>\n<p>下面还有一题，把上面几题结合了，我就不写答案了</p>\n<h3 data-id=\"heading-6\">你来搞定她</h3>\n<pre><code class=\"hljs language-js copyable\" lang=\"js\"><span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">async1</span> ()  </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'async1 start\'</span>);\n    <span class=\"hljs-keyword\">await</span>  async2();\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'async1 end\'</span>)\n}\n\n<span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span>  <span class=\"hljs-title\">async2</span> ()  </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'async2\'</span>)\n}\n\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'script start\'</span>);\n\n<span class=\"hljs-built_in\">setTimeout</span>(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> ()  </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'setTimeout\'</span>)\n},  <span class=\"hljs-number\">0</span>);\n\nasync1();\n\n<span class=\"hljs-keyword\">new</span> <span class=\"hljs-built_in\">Promise</span>(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> (<span class=\"hljs-params\">resolve</span>)  </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'promise1\'</span>);\n    resolve()\n}).then(<span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> ()  </span>{\n    <span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'promise2\'</span>)\n});\n\n<span class=\"hljs-built_in\">console</span>.log(<span class=\"hljs-string\">\'script end\'</span>)\n<span class=\"copy-code-btn\">复制代码</span></code></pre>\n<h2 data-id=\"heading-7\">结语</h2>\n<p>点赞支持、手留余香、与有荣焉</p>\n<p>感谢你能看到这里，加油哦！</p>\n<h2 data-id=\"heading-8\">参考</h2>\n<p><a title=\"https://time.geekbang.org/column/intro/216\" href=\"https://link.juejin.cn?target=https%3A%2F%2Ftime.geekbang.org%2Fcolumn%2Fintro%2F216\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">浏览器工作原理与实践</a></p>\n</div>', null, null, '0', '0', '0', '0', '1', '0');
INSERT INTO `cms_article` VALUES ('7483bae5-ce55-48fe-afc6-d14a13a20ad1', '1', '', '2021-08-07 01:49:38.827024', null, '2021-08-07 01:49:38.827024', null, '0', null, null, '前端万字面经——进阶篇', '这是我参与8月更文挑战的第2天，活动详情查看:8月更文挑战', null, null, null, '0', '', null, '', '', '0', '<h3 data-id=\"heading-1\">JSONP 的缺点</h3>\n<ul>\n<li>JSON 只支持get，因为script 标签只能使用get 请求；</li>\n<li>JSONP 需要后端配合返回指定格式的数据。</li>\n</ul>\n<h3 data-id=\"heading-2\">跨域（jsonp，ajax）</h3>\n<p>JSONP：ajax 请求受同源策略影响，不允许进行跨域请求，而script 标签src 属性中的链 接却可以访问跨域的js 脚本，利用这个特性，服务端不再返回JSON 格式的数据，而是 返回一段调用某个函数的js 代码，在src 中进行了调用，这样实现了跨域。</p>\n<h3 data-id=\"heading-3\">如何实现跨域</h3>\n<ul>\n<li>JSONP：通过动态创建script，再请求一个带参网址实现跨域通信。document.domain +iframe 跨域：两个页面都通过js 强制设置document.domain 为基础主域，就实现了同域。location.hash + iframe 跨域：a 欲与b 跨域相互通信，通过中间页c 来实现。三个页面，不同域之间利用iframe 的location.hash 传值，相同域之间直接js 访问来通信。window.name + iframe 跨域：通过iframe 的src 属性由外域转向本地域，跨域数据即由iframe的window.name 从外域传递到本地域。</li>\n<li>postMessage 跨域：可以跨域操作的window 属性之一。</li>\n<li>CORS：服务端设置Access-Control-Allow-Origin 即可，前端无须设置，若要带cookie 请求，前后端都需要设置。</li>\n<li>代理跨域：起一个代理服务器，实现数据的转发</li>\n</ul>\n<h3 data-id=\"heading-4\">实现一个Ajax</h3>\n<p>AJAX 创建异步对象XMLHttpRequest操作XMLHttpRequest 对象</p>\n<ol>\n<li>设置请求参数（请求方式，请求页面的相对路径，是否异步）</li>\n<li>设置回调函数，一个处理服务器响应的函数，使用onreadystatechange ，类似函数指针</li>\n<li>获取异步对象的readyState 属性：该属性存有服务器响应的状态信息。每当readyState 改变时，onreadystatechange 函数就会被执行。</li>\n<li>判断响应报文的状态，若为200 说明服务器正常运行并返回响应数据。</li>\n<li>读取响应数据，可以通过responseText 属性来取回由服务器返回的数据。</li>\n</ol>', null, null, '0', '0', '0', '0', '1', '0');
INSERT INTO `cms_article` VALUES ('90caa2d6-2194-49be-8108-01860297fcaa', '2', '', '2021-08-07 01:54:31.770892', null, '2021-08-07 02:35:53.000000', null, '0', null, null, '在腾讯工作是一种怎样的体验？', '先上工牌，今年夏天入职的鹅厂，坐标深圳', null, null, null, '0', '', null, '', '', '0', '<div>\n<h2 data-id=\"heading-0\">生活</h2>\n<p>很幸运办公地点在滨海大厦，就是目前鹅厂最新的栋，可以竞选大厂最气派的办公地点了（没有之一）！！！</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d50b19088a4d469391107a2c6147281d~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"\" /></p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1f84573c856c4ed4882a499e10af1def~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"\" /></p>\n<p>室内也应有尽有，桌球、羽毛球、篮球、乒乓球、攀岩、瑜伽馆都有，还有室内跑道，健身房也超级大，而且全部免费对员工开放。</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce6eda6d984a426db284d3e3f55671b6~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"image-20210805202120983\" /></p>\n<p>晚上健身房人也很多，虽然没有 work life balance，但是 work practice balance 还是很不错的！</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77a35ca8c3c747d2a25b0a8f8fc1cb53~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"image-20210805202523230\" /></p>\n<p>室内的攀岩场，想问问这环境还有谁！！</p>\n<p>早餐都是免费的，不得不说滨海肠粉真的一绝，每次队伍都老长了。</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/227dd57d8d514e55904d1a809f4e5fcd~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"image-20210805203448122\" /></p>\n<p>午餐是要自己花钱的，大概 20 左右，晚餐可以用夜宵券抵扣，基本都能随便吃，还能在附近的肯德基麦当劳用，夜宵券是只要八点之后下班就可以自动领一张（互联网公司的惯用督促加班技俩了）。</p>\n<p>随便吃真的想不胖都难！！</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3daa81a600f84bfdbc66cbf2775466ed~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"image-20210722233410313\" /></p>\n<p>不得不说腾讯内部的各种内部工具是真的好用，电子工牌、腾讯访客这类小程序啥的老方便了，可以随时带朋友来参观大厦。</p>\n<h2 data-id=\"heading-1\">工作</h2>\n<p>再聊聊工作时长，每个部门的工作时间不一样，作息也不同，这边一般正常情况都是 995 左右，在项目上线阶段会加班。</p>\n<p>早上一般十点之前大家陆陆续续才到，中午一般十一点半左右去干饭，然后和同事散二十分钟步，聊聊互联网的大小事，然后午休到两点左右开始认真干货。</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a41280f3b6a24dc5a71f95a47143e3c5~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"xx\" /></p>\n<blockquote>\n<p>在滨海看日落真的绝了</p>\n</blockquote>\n<p>晚上五点半左右干饭，干完散散步摸摸鱼，到快七点开始干活。</p>\n<p>满打满算每天真正工作时间可能也就在八小时左右，当然这是在比较闲的情况下，加班当然是有的，遇到项目上线到凌晨也是有的。</p>\n<h2 data-id=\"heading-2\">福利</h2>\n<p>无大小周、每月半价 Q 币、每年免费洁一次牙、部门团建、员工子女专属 QQ 号加 18 年 QQ 会员、免息贷款、节假日礼包、开工利是，马爸爸对待员工还是好不吝啬的。</p>\n<p><a title=\"https://imgtu.com/i/WDHE9J\" href=\"https://link.juejin.cn?target=https%3A%2F%2Fimgtu.com%2Fi%2FWDHE9J\" target=\"_blank\" rel=\"nofollow noopener noreferrer\"><img src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d079b01f5a064c28ae5831af5a69d6b0~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"WDHE9J.jpg\" /></a></p>\n<blockquote>\n<p>公仔厂的外号也不是吹的！</p>\n</blockquote>\n<p>去年的阳光普照奖（约等于6w+），各种加一起总包在大厂中也能达到第一梯队了，不过年终如何还是得看部门，据说在人上人 wxg 二十几薪的也不少。</p>\n<h2 data-id=\"heading-3\">氛围</h2>\n<p>同事大多 985 起步，其中不乏各种海归，研究生也遍地都是，大佬很多，卧虎藏龙，可能走在路上一个其貌不扬的人，就是某个领域的大牛。</p>\n<p>当然了，双非也是有的，笔者就是，不过比例还是比较少的，原因懂的都懂吧。。。</p>\n<p>不过上下级之间管理会相对扁平化，有可能坐你对面工位的就是某某总监，旁边就是某某 Leader。公司内 35 岁以上的前辈也很多，听一些前辈讲中年危机并没有网上所散播的那么严重。</p>\n<p>技术层面将其实看部门，有些部门会有很多历史遗留项目，\"屎山\"也是有的，\"铲屎\"痛不欲生的感觉几乎没有人想去感受。</p>\n<p>不过，部门与部门的差距往往有时候能大过宇宙，在鹅厂非常牛通的部门也有很多，比如天美、微信。。</p>\n<p>技术氛围还是可以的，不同部门也有很多内部的框架，有一些没有开源，只是内部使用，还有一些比较有名的开源项目比如 RPC 框架 tars。</p>\n<p>公司内部的培训很多，明天可能会收到好几封讲座的邮件，很多不仅能听到大牛分享经验，有时候还能顺手领个T恤公仔啥的。</p>\n<p>对了。。公仔还能在楼下爱马哥(image&mdash;鹅厂自营店) 店里买，又一个工资回收计划。。</p>\n<p><img class=\"medium-zoom-image\" src=\"https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df0d0df6ab2e46589917784b6454d7e4~tplv-k3u1fbpfcp-watermark.awebp\" alt=\"31772E5D064627E0CA45FB7BFCE40E89\" /></p>\n<h2 data-id=\"heading-4\">总结</h2>\n<p>虽然腾讯在大多数地方做的几乎都非常好，但还是有一些不那么好的地方，比如工作压力，这个地方没有人会 push 你，上级只会要求你做的要比期望的更好，如果你完成了你应该做的任务，你只是一名<code>合格</code>的员工，也就是中等绩效，你只能去不断 push 自己，这也是我们所说的<code>自驱力</code>吧。</p>\n<p>虽然压力大，但起码，在大厂，收获与付出是等价的。</p>\n<p>文章的最后，给大家推荐一个 github ，<a title=\"https://github.com/crisxuan/bestJavaer\" href=\"https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fcrisxuan%2FbestJavaer\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">github.com/crisxuan/be&hellip;</a> 这个 github 是我呕心沥血所有文章的汇总，非常硬核， 欢迎 star 。</p>\n</div>', null, null, '0', '0', '0', '0', '1', '0');
INSERT INTO `cms_article` VALUES ('bdf078c5-bb0f-42b3-8317-1a06792fa1ee', '1', '', '2021-08-07 01:51:36.699893', null, '2021-08-07 01:51:36.699893', null, '0', null, null, '浏览器工作原理与实践', '透过浏览器看懂前端本质', null, null, null, '1', '', null, 'https://time.geekbang.org/column/intro/216', '', '0', '', null, null, '0', '0', '0', '0', '1', '0');
INSERT INTO `cms_article` VALUES ('d064ec1b-5e43-4b6d-aa6e-444513c130b4', '1', '', '2021-08-07 01:52:42.746599', null, '2021-08-07 01:52:42.746599', null, '0', null, null, '最小化K8s环境部署之Minikube', '这是我参与8月更文挑战的第1天，活动详情查看:8月更文挑战', null, null, null, '0', '', null, '', '', '0', '<div>\n<h1 data-id=\"heading-0\">最小化K8s环境部署之Minikube</h1>\n<h1 data-id=\"heading-1\">一 背景</h1>\n<p>最近需要给开发相关同时培训K8s，集群方式部署负责且占用资源多，简单快捷高效的单机版K8s环境，可谓开发人员不错的选择，minikube就是为解决这个问题而衍生出来的工具，它基于go语言开发， 是一个易于在本地运行 Kubernetes 的工具，可在你的笔记本电脑上的虚拟机内轻松创建单机版 Kubernetes 集群。便于尝试 Kubernetes 或使用 Kubernetes 日常开发。可以在单机环境下快速搭建可用的k8s集群，非常适合测试和本地开发。如果没有服务器或在本地笔记本安装，则可以在线使用<a title=\"https://labs.play-with-k8s.com/%E6%9D%A5%E4%BD%93%E9%AA%8CK8s%E3%80%82\" href=\"https://link.juejin.cn?target=https%3A%2F%2Flabs.play-with-k8s.com%2F%25E6%259D%25A5%25E4%25BD%2593%25E9%25AA%258CK8s%25E3%2580%2582\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">labs.play-with-k8s.com/来体验K8s。</a></p>\n<h1 data-id=\"heading-2\">二 Minikube简介</h1>\n<h2 data-id=\"heading-3\">2.1 主要组件</h2>\n<h3 data-id=\"heading-4\"><strong>localkube</strong></h3>\n<p>为了运行和管理 Kubernetes 的组件，Minikube 中使用了 Spread\'s 的 localkube，localkube 是一个独立的 Go 语言的二进制包，包含了所有 Kubernetes 的主要组件，并且以不同的 goroutine 来运行。</p>\n<h3 data-id=\"heading-5\"><strong>libmachine</strong></h3>\n<p>为了支持 MacOS 和 Windows，Minikube 在内部使用 libmachine 创建或销毁虚拟机，可以将它理解为一个虚拟机的驱动程序。至于在 Linux 上，由于集群可以直接本地运行，所以避免设置虚拟机。</p>\n<h2 data-id=\"heading-6\">2.2 启动流程</h2>\n<ul>\n<li>通过 libmachine 启动虚拟机，生成 Docker 相关证书及配置文件，启动 Docker;</li>\n<li>生成 Kubernetes 相关配置文件和 addons，以及相关证书，拷贝至虚拟机;</li>\n<li>基于之前的配置文件，生成启动脚本，启动 Kubernetes 集群，并可以通过 Client 进行访问。</li>\n</ul>\n<h3 data-id=\"heading-7\">MacOS/Windows</h3>\n<ul>\n<li>minikube -&gt; libmachine -&gt; virtualbox/hyper V -&gt; linux VM -&gt; localkube</li>\n</ul>\n<h3 data-id=\"heading-8\">Linux</h3>\n<ul>\n<li>minikube -&gt; docker -&gt; localkube</li>\n</ul>\n</div>', null, null, '0', '0', '0', '0', '1', '0');

-- ----------------------------
-- Table structure for cms_article_cat
-- ----------------------------
DROP TABLE IF EXISTS `cms_article_cat`;
CREATE TABLE `cms_article_cat` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `parentId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '父 id',
  `catName` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '栏目名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cms_article_cat
-- ----------------------------
INSERT INTO `cms_article_cat` VALUES ('1527bffa-33e5-43a4-a51e-8c6cf77a7afc', '1', null, '2021-08-07 01:35:57.275245', null, '2021-08-07 01:35:57.275245', null, '0', null, null, 'd7ee8336-d965-4a4e-9e7b-820392bb3dd8', '后端');
INSERT INTO `cms_article_cat` VALUES ('23a2eb7e-2072-47a8-abfe-90ae20a7d589', '1', null, '2021-08-07 01:33:08.690836', null, '2021-08-07 01:33:08.690836', null, '0', null, null, 'ac31b881-acb5-4134-8e60-68e541ee97e5', '测试');
INSERT INTO `cms_article_cat` VALUES ('461be376-da43-41df-873d-5e89caed8081', '1', null, '2021-08-07 01:32:19.285488', null, '2021-08-07 01:32:19.285488', null, '0', null, null, null, '会计');
INSERT INTO `cms_article_cat` VALUES ('8624221c-f185-47b7-b426-4dee8e6d9502', '1', null, '2021-08-07 01:33:59.000000', null, '2021-08-07 01:34:24.000000', null, '0', '2021-08-06 17:34:24.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', 'd7ee8336-d965-4a4e-9e7b-820392bb3dd8', '前端');
INSERT INTO `cms_article_cat` VALUES ('abe935a3-ad05-43f8-b093-8d8a6cb8d411', '1', null, '2021-08-07 01:32:26.828831', null, '2021-08-07 01:32:26.828831', null, '0', null, null, null, '金融');
INSERT INTO `cms_article_cat` VALUES ('ac31b881-acb5-4134-8e60-68e541ee97e5', '1', null, '2021-08-07 01:32:06.171883', null, '2021-08-07 01:32:06.171883', null, '0', null, null, null, '计算机');
INSERT INTO `cms_article_cat` VALUES ('b4311311-b633-4c93-b348-1ad3673e47f3', '1', null, '2021-08-07 01:36:19.224224', null, '2021-08-07 01:36:19.224224', null, '0', null, null, 'd7ee8336-d965-4a4e-9e7b-820392bb3dd8', '全栈');
INSERT INTO `cms_article_cat` VALUES ('d7ee8336-d965-4a4e-9e7b-820392bb3dd8', '1', null, '2021-08-07 01:32:56.459408', null, '2021-08-07 01:32:56.459408', null, '0', null, null, 'ac31b881-acb5-4134-8e60-68e541ee97e5', '开发');

-- ----------------------------
-- Table structure for cms_article_data_cat
-- ----------------------------
DROP TABLE IF EXISTS `cms_article_data_cat`;
CREATE TABLE `cms_article_data_cat` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `articleId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  `catId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  KEY `FK_0443eef44f7502a44610725b751` (`articleId`),
  KEY `FK_47ff4ec17cce44dfe7b56d4ac07` (`catId`),
  CONSTRAINT `FK_0443eef44f7502a44610725b751` FOREIGN KEY (`articleId`) REFERENCES `cms_article` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_47ff4ec17cce44dfe7b56d4ac07` FOREIGN KEY (`catId`) REFERENCES `cms_article_cat` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of cms_article_data_cat
-- ----------------------------
INSERT INTO `cms_article_data_cat` VALUES ('1b90435f-edf0-4cc8-bfe6-8b6ae76797c4', '90caa2d6-2194-49be-8108-01860297fcaa', '1527bffa-33e5-43a4-a51e-8c6cf77a7afc');
INSERT INTO `cms_article_data_cat` VALUES ('22198e93-9804-42b3-9ccf-3b7a95d49038', 'bdf078c5-bb0f-42b3-8317-1a06792fa1ee', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('24a451e8-9c06-4902-a899-5c796f3d2c02', '16eda59a-2953-453b-aac0-0bba030d57c6', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('440a705a-b4c8-4901-a289-765ffd3cfbd0', 'd064ec1b-5e43-4b6d-aa6e-444513c130b4', '1527bffa-33e5-43a4-a51e-8c6cf77a7afc');
INSERT INTO `cms_article_data_cat` VALUES ('4a4dc735-61d0-441d-abe9-33b2c54724cc', '90caa2d6-2194-49be-8108-01860297fcaa', '8624221c-f185-47b7-b426-4dee8e6d9502');
INSERT INTO `cms_article_data_cat` VALUES ('f11533a7-3986-4820-b84a-da513c988b76', '7483bae5-ce55-48fe-afc6-d14a13a20ad1', '8624221c-f185-47b7-b426-4dee8e6d9502');

-- ----------------------------
-- Table structure for sys_area
-- ----------------------------
DROP TABLE IF EXISTS `sys_area`;
CREATE TABLE `sys_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键 id',
  `parentId` int(11) NOT NULL COMMENT '父 id',
  `areaCode` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '地区编码',
  `areaName` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '地区名称',
  `level` tinyint(4) DEFAULT NULL COMMENT '地区级别（1：省份 province；2：城市 city；3：区/县 district；4：街道/办 street）',
  `cityCode` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '城市编码',
  `center` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '城市中心点（即：经纬度坐标）',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3260 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_area
-- ----------------------------
INSERT INTO `sys_area` VALUES ('1', '-1', '110000', '北京市', '1', '010', '116.407394,39.904211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2', '1', '110100', '北京城区', '2', '010', '116.407394,39.904211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3', '2', '110101', '东城区', '3', '010', '116.41649,39.928341', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('4', '2', '110102', '西城区', '3', '010', '116.365873,39.912235', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('5', '2', '110105', '朝阳区', '3', '010', '116.443205,39.921506', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('6', '2', '110106', '丰台区', '3', '010', '116.287039,39.858421', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('7', '2', '110107', '石景山区', '3', '010', '116.222933,39.906611', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('8', '2', '110108', '海淀区', '3', '010', '116.298262,39.95993', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('9', '2', '110109', '门头沟区', '3', '010', '116.101719,39.940338', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('10', '2', '110111', '房山区', '3', '010', '116.143486,39.748823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('11', '2', '110112', '通州区', '3', '010', '116.656434,39.909946', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('12', '2', '110113', '顺义区', '3', '010', '116.654642,40.130211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('13', '2', '110114', '昌平区', '3', '010', '116.231254,40.220804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('14', '2', '110115', '大兴区', '3', '010', '116.341483,39.726917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('15', '2', '110116', '怀柔区', '3', '010', '116.631931,40.316053', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('16', '2', '110117', '平谷区', '3', '010', '117.121351,40.140595', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('17', '2', '110118', '密云区', '3', '010', '116.843047,40.376894', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('18', '2', '110119', '延庆区', '3', '010', '115.974981,40.456591', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('19', '-1', '120000', '天津市', '1', '022', '117.200983,39.084158', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('20', '19', '120100', '天津城区', '2', '022', '117.200983,39.084158', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('21', '20', '120101', '和平区', '3', '022', '117.214699,39.117196', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('22', '20', '120102', '河东区', '3', '022', '117.251584,39.128294', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('23', '20', '120103', '河西区', '3', '022', '117.223371,39.109563', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('24', '20', '120104', '南开区', '3', '022', '117.150738,39.138205', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('25', '20', '120105', '河北区', '3', '022', '117.196648,39.147869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('26', '20', '120106', '红桥区', '3', '022', '117.151533,39.167345', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('27', '20', '120110', '东丽区', '3', '022', '117.31362,39.086802', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('28', '20', '120111', '西青区', '3', '022', '117.008826,39.141152', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('29', '20', '120112', '津南区', '3', '022', '117.35726,38.937928', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('30', '20', '120113', '北辰区', '3', '022', '117.135488,39.224791', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('31', '20', '120114', '武清区', '3', '022', '117.044387,39.384119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('32', '20', '120115', '宝坻区', '3', '022', '117.309874,39.717564', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('33', '20', '120116', '滨海新区', '3', '022', '117.698407,39.01727', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('34', '20', '120117', '宁河区', '3', '022', '117.826724,39.330087', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('35', '20', '120118', '静海区', '3', '022', '116.974232,38.94745', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('36', '20', '120119', '蓟州区', '3', '022', '117.408296,40.045851', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('37', '-1', '130000', '河北省', '1', '[]', '114.530235,38.037433', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('38', '37', '130100', '石家庄市', '2', '0311', '114.514793,38.042228', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('39', '38', '130102', '长安区', '3', '0311', '114.539395,38.036347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('40', '38', '130104', '桥西区', '3', '0311', '114.461088,38.004193', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('41', '38', '130105', '新华区', '3', '0311', '114.463377,38.05095', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('42', '38', '130107', '井陉矿区', '3', '0311', '114.062062,38.065151', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('43', '38', '130108', '裕华区', '3', '0311', '114.531202,38.00643', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('44', '38', '130109', '藁城区', '3', '0311', '114.847023,38.021453', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('45', '38', '130110', '鹿泉区', '3', '0311', '114.313654,38.085953', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('46', '38', '130111', '栾城区', '3', '0311', '114.648318,37.900199', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('47', '38', '130121', '井陉县', '3', '0311', '114.145242,38.032118', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('48', '38', '130123', '正定县', '3', '0311', '114.570941,38.146444', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('49', '38', '130125', '行唐县', '3', '0311', '114.552714,38.438377', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('50', '38', '130126', '灵寿县', '3', '0311', '114.382614,38.308665', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('51', '38', '130127', '高邑县', '3', '0311', '114.611121,37.615534', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('52', '38', '130128', '深泽县', '3', '0311', '115.20092,38.184033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('53', '38', '130129', '赞皇县', '3', '0311', '114.386111,37.665663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('54', '38', '130130', '无极县', '3', '0311', '114.97634,38.179192', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('55', '38', '130131', '平山县', '3', '0311', '114.195918,38.247888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('56', '38', '130132', '元氏县', '3', '0311', '114.525409,37.766513', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('57', '38', '130133', '赵县', '3', '0311', '114.776297,37.756578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('58', '38', '130181', '辛集市', '3', '0311', '115.217658,37.943121', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('59', '38', '130183', '晋州市', '3', '0311', '115.044213,38.033671', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('60', '38', '130184', '新乐市', '3', '0311', '114.683776,38.343319', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('61', '37', '130200', '唐山市', '2', '0315', '118.180193,39.630867', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('62', '61', '130202', '路南区', '3', '0315', '118.154354,39.625058', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('63', '61', '130203', '路北区', '3', '0315', '118.200692,39.624437', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('64', '61', '130204', '古冶区', '3', '0315', '118.447635,39.733578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('65', '61', '130205', '开平区', '3', '0315', '118.261841,39.671001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('66', '61', '130207', '丰南区', '3', '0315', '118.085169,39.576031', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('67', '61', '130208', '丰润区', '3', '0315', '118.162215,39.832582', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('68', '61', '130209', '曹妃甸区', '3', '0315', '118.460379,39.27307', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('69', '61', '130223', '滦县', '3', '0315', '118.703598,39.740593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('70', '61', '130224', '滦南县', '3', '0315', '118.682379,39.518996', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('71', '61', '130225', '乐亭县', '3', '0315', '118.912571,39.425608', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('72', '61', '130227', '迁西县', '3', '0315', '118.314715,40.1415', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('73', '61', '130229', '玉田县', '3', '0315', '117.738658,39.900401', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('74', '61', '130281', '遵化市', '3', '0315', '117.965892,40.189201', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('75', '61', '130283', '迁安市', '3', '0315', '118.701144,39.999174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('76', '37', '130300', '秦皇岛市', '2', '0335', '119.518197,39.888701', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('77', '76', '130302', '海港区', '3', '0335', '119.564962,39.94756', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('78', '76', '130303', '山海关区', '3', '0335', '119.775799,39.978848', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('79', '76', '130304', '北戴河区', '3', '0335', '119.484522,39.834596', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('80', '76', '130306', '抚宁区', '3', '0335', '119.244847,39.876253', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('81', '76', '130321', '青龙满族自治县', '3', '0335', '118.949684,40.407578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('82', '76', '130322', '昌黎县', '3', '0335', '119.199551,39.700911', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('83', '76', '130324', '卢龙县', '3', '0335', '118.892986,39.891946', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('84', '37', '130400', '邯郸市', '2', '0310', '114.538959,36.625594', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('85', '84', '130402', '邯山区', '3', '0310', '114.531002,36.594313', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('86', '84', '130403', '丛台区', '3', '0310', '114.492896,36.636409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('87', '84', '130404', '复兴区', '3', '0310', '114.462061,36.639033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('88', '84', '130406', '峰峰矿区', '3', '0310', '114.212802,36.419739', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('89', '84', '130423', '临漳县', '3', '0310', '114.619536,36.335025', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('90', '84', '130424', '成安县', '3', '0310', '114.670032,36.444317', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('91', '84', '130425', '大名县', '3', '0310', '115.147814,36.285616', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('92', '84', '130426', '涉县', '3', '0310', '113.6914,36.584994', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('93', '84', '130427', '磁县', '3', '0310', '114.373946,36.374011', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('94', '84', '130407', '肥乡区', '3', '0310', '114.800166,36.548131', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('95', '84', '130408', '永年区', '3', '0310', '114.543832,36.743966', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('96', '84', '130430', '邱县', '3', '0310', '115.200589,36.811148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('97', '84', '130431', '鸡泽县', '3', '0310', '114.889376,36.91034', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('98', '84', '130432', '广平县', '3', '0310', '114.948606,36.483484', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('99', '84', '130433', '馆陶县', '3', '0310', '115.282467,36.547556', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('100', '84', '130434', '魏县', '3', '0310', '114.93892,36.359868', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('101', '84', '130435', '曲周县', '3', '0310', '114.957504,36.76607', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('102', '84', '130481', '武安市', '3', '0310', '114.203697,36.696506', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('103', '37', '130500', '邢台市', '2', '0319', '114.504677,37.070834', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('104', '103', '130502', '桥东区', '3', '0319', '114.507058,37.071287', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('105', '103', '130503', '桥西区', '3', '0319', '114.468601,37.059827', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('106', '103', '130521', '邢台县', '3', '0319', '114.561132,37.05073', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('107', '103', '130522', '临城县', '3', '0319', '114.498761,37.444498', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('108', '103', '130523', '内丘县', '3', '0319', '114.512128,37.286669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('109', '103', '130524', '柏乡县', '3', '0319', '114.693425,37.482422', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('110', '103', '130525', '隆尧县', '3', '0319', '114.770419,37.350172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('111', '103', '130526', '任县', '3', '0319', '114.671936,37.120982', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('112', '103', '130527', '南和县', '3', '0319', '114.683863,37.005017', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('113', '103', '130528', '宁晋县', '3', '0319', '114.93992,37.624564', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('114', '103', '130529', '巨鹿县', '3', '0319', '115.037477,37.221112', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('115', '103', '130530', '新河县', '3', '0319', '115.250907,37.520862', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('116', '103', '130531', '广宗县', '3', '0319', '115.142626,37.074661', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('117', '103', '130532', '平乡县', '3', '0319', '115.030075,37.063148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('118', '103', '130533', '威县', '3', '0319', '115.266703,36.975478', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('119', '103', '130534', '清河县', '3', '0319', '115.667208,37.039991', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('120', '103', '130535', '临西县', '3', '0319', '115.501048,36.870811', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('121', '103', '130581', '南宫市', '3', '0319', '115.408747,37.359264', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('122', '103', '130582', '沙河市', '3', '0319', '114.503339,36.854929', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('123', '37', '130600', '保定市', '2', '0312', '115.464589,38.874434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('124', '123', '130602', '竞秀区', '3', '0312', '115.45877,38.877449', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('125', '123', '130606', '莲池区', '3', '0312', '115.497097,38.883582', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('126', '123', '130607', '满城区', '3', '0312', '115.322334,38.949119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('127', '123', '130608', '清苑区', '3', '0312', '115.489959,38.765148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('128', '123', '130609', '徐水区', '3', '0312', '115.655774,39.018736', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('129', '123', '130623', '涞水县', '3', '0312', '115.713904,39.394316', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('130', '123', '130624', '阜平县', '3', '0312', '114.195104,38.849152', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('131', '123', '130626', '定兴县', '3', '0312', '115.808296,39.263145', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('132', '123', '130627', '唐县', '3', '0312', '114.982972,38.748203', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('133', '123', '130628', '高阳县', '3', '0312', '115.778965,38.700088', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('134', '123', '130629', '容城县', '3', '0312', '115.861657,39.042784', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('135', '123', '130630', '涞源县', '3', '0312', '114.694283,39.360247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('136', '123', '130631', '望都县', '3', '0312', '115.155128,38.695842', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('137', '123', '130632', '安新县', '3', '0312', '115.935603,38.935369', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('138', '123', '130633', '易县', '3', '0312', '115.497457,39.349393', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('139', '123', '130634', '曲阳县', '3', '0312', '114.745008,38.622248', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('140', '123', '130635', '蠡县', '3', '0312', '115.583854,38.488055', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('141', '123', '130636', '顺平县', '3', '0312', '115.13547,38.837487', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('142', '123', '130637', '博野县', '3', '0312', '115.46438,38.457364', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('143', '123', '130638', '雄县', '3', '0312', '116.10865,38.99455', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('144', '123', '130681', '涿州市', '3', '0312', '115.974422,39.485282', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('145', '123', '130682', '定州市', '3', '0312', '114.990392,38.516461', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('146', '123', '130683', '安国市', '3', '0312', '115.326646,38.418439', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('147', '123', '130684', '高碑店市', '3', '0312', '115.873886,39.326839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('148', '37', '130700', '张家口市', '2', '0313', '114.886252,40.768493', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('149', '148', '130702', '桥东区', '3', '0313', '114.894189,40.788434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('150', '148', '130703', '桥西区', '3', '0313', '114.869657,40.819581', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('151', '148', '130705', '宣化区', '3', '0313', '115.099494,40.608793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('152', '148', '130706', '下花园区', '3', '0313', '115.287352,40.502652', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('153', '148', '130708', '万全区', '3', '0313', '114.740557,40.766965', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('154', '148', '130709', '崇礼区', '3', '0313', '115.282668,40.974675', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('155', '148', '130722', '张北县', '3', '0313', '114.720077,41.158596', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('156', '148', '130723', '康保县', '3', '0313', '114.600404,41.852368', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('157', '148', '130724', '沽源县', '3', '0313', '115.688692,41.669668', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('158', '148', '130725', '尚义县', '3', '0313', '113.969618,41.076226', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('159', '148', '130726', '蔚县', '3', '0313', '114.588903,39.840842', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('160', '148', '130727', '阳原县', '3', '0313', '114.150348,40.104663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('161', '148', '130728', '怀安县', '3', '0313', '114.385791,40.674193', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('162', '148', '130730', '怀来县', '3', '0313', '115.517861,40.415343', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('163', '148', '130731', '涿鹿县', '3', '0313', '115.205345,40.379562', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('164', '148', '130732', '赤城县', '3', '0313', '115.831498,40.912921', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('165', '37', '130800', '承德市', '2', '0314', '117.962749,40.952942', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('166', '165', '130802', '双桥区', '3', '0314', '117.943466,40.974643', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('167', '165', '130803', '双滦区', '3', '0314', '117.799888,40.959236', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('168', '165', '130804', '鹰手营子矿区', '3', '0314', '117.659499,40.546361', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('169', '165', '130821', '承德县', '3', '0314', '118.173824,40.768238', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('170', '165', '130822', '兴隆县', '3', '0314', '117.500558,40.417358', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('171', '165', '130881', '平泉市', '3', '0314', '118.701951,41.018405', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('172', '165', '130824', '滦平县', '3', '0314', '117.332801,40.941482', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('173', '165', '130825', '隆化县', '3', '0314', '117.738937,41.313791', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('174', '165', '130826', '丰宁满族自治县', '3', '0314', '116.646051,41.209069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('175', '165', '130827', '宽城满族自治县', '3', '0314', '118.485313,40.611391', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('176', '165', '130828', '围场满族蒙古族自治县', '3', '0314', '117.760159,41.938529', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('177', '37', '130900', '沧州市', '2', '0317', '116.838834,38.304477', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('178', '177', '130902', '新华区', '3', '0317', '116.866284,38.314416', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('179', '177', '130903', '运河区', '3', '0317', '116.843673,38.283749', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('180', '177', '130921', '沧县', '3', '0317', '117.007478,38.219856', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('181', '177', '130922', '青县', '3', '0317', '116.804305,38.583021', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('182', '177', '130923', '东光县', '3', '0317', '116.537067,37.888248', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('183', '177', '130924', '海兴县', '3', '0317', '117.497651,38.143169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('184', '177', '130925', '盐山县', '3', '0317', '117.230602,38.058087', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('185', '177', '130926', '肃宁县', '3', '0317', '115.829758,38.422801', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('186', '177', '130927', '南皮县', '3', '0317', '116.708347,38.038421', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('187', '177', '130928', '吴桥县', '3', '0317', '116.391508,37.627661', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('188', '177', '130929', '献县', '3', '0317', '116.122725,38.190185', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('189', '177', '130930', '孟村回族自治县', '3', '0317', '117.104298,38.053409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('190', '177', '130981', '泊头市', '3', '0317', '116.578367,38.083437', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('191', '177', '130982', '任丘市', '3', '0317', '116.082917,38.683591', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('192', '177', '130983', '黄骅市', '3', '0317', '117.329949,38.371402', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('193', '177', '130984', '河间市', '3', '0317', '116.099517,38.446624', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('194', '37', '131000', '廊坊市', '2', '0316', '116.683752,39.538047', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('195', '194', '131002', '安次区', '3', '0316', '116.694544,39.502569', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('196', '194', '131003', '广阳区', '3', '0316', '116.71069,39.522786', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('197', '194', '131022', '固安县', '3', '0316', '116.298657,39.438214', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('198', '194', '131023', '永清县', '3', '0316', '116.50568,39.330689', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('199', '194', '131024', '香河县', '3', '0316', '117.006093,39.761424', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('200', '194', '131025', '大城县', '3', '0316', '116.653793,38.705449', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('201', '194', '131026', '文安县', '3', '0316', '116.457898,38.87292', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('202', '194', '131028', '大厂回族自治县', '3', '0316', '116.989574,39.886547', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('203', '194', '131081', '霸州市', '3', '0316', '116.391484,39.125744', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('204', '194', '131082', '三河市', '3', '0316', '117.078294,39.982718', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('205', '37', '131100', '衡水市', '2', '0318', '115.670177,37.73892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('206', '205', '131102', '桃城区', '3', '0318', '115.67545,37.735465', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('207', '205', '131103', '冀州区', '3', '0318', '115.579308,37.550856', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('208', '205', '131121', '枣强县', '3', '0318', '115.724259,37.513417', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('209', '205', '131122', '武邑县', '3', '0318', '115.887531,37.801665', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('210', '205', '131123', '武强县', '3', '0318', '115.982461,38.041368', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('211', '205', '131124', '饶阳县', '3', '0318', '115.725833,38.235892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('212', '205', '131125', '安平县', '3', '0318', '115.519278,38.234501', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('213', '205', '131126', '故城县', '3', '0318', '115.965874,37.347409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('214', '205', '131127', '景县', '3', '0318', '116.270648,37.69229', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('215', '205', '131128', '阜城县', '3', '0318', '116.175262,37.862505', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('216', '205', '131182', '深州市', '3', '0318', '115.559574,38.001535', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('217', '-1', '140000', '山西省', '1', '[]', '112.562678,37.873499', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('218', '217', '140100', '太原市', '2', '0351', '112.548879,37.87059', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('219', '218', '140105', '小店区', '3', '0351', '112.565659,37.736525', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('220', '218', '140106', '迎泽区', '3', '0351', '112.5634,37.863451', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('221', '218', '140107', '杏花岭区', '3', '0351', '112.570604,37.893955', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('222', '218', '140108', '尖草坪区', '3', '0351', '112.486691,37.940387', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('223', '218', '140109', '万柏林区', '3', '0351', '112.515937,37.85958', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('224', '218', '140110', '晋源区', '3', '0351', '112.47794,37.715193', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('225', '218', '140121', '清徐县', '3', '0351', '112.358667,37.607443', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('226', '218', '140122', '阳曲县', '3', '0351', '112.672952,38.058488', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('227', '218', '140123', '娄烦县', '3', '0351', '111.797083,38.067932', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('228', '218', '140181', '古交市', '3', '0351', '112.175853,37.907129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('229', '217', '140200', '大同市', '2', '0352', '113.300129,40.076763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('230', '229', '140202', '城区', '3', '0352', '113.298026,40.075666', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('231', '229', '140203', '矿区', '3', '0352', '113.177206,40.036858', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('232', '229', '140211', '南郊区', '3', '0352', '113.149693,40.005404', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('233', '229', '140212', '新荣区', '3', '0352', '113.140004,40.255866', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('234', '229', '140221', '阳高县', '3', '0352', '113.748944,40.361059', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('235', '229', '140222', '天镇县', '3', '0352', '114.090867,40.420237', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('236', '229', '140223', '广灵县', '3', '0352', '114.282758,39.760281', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('237', '229', '140224', '灵丘县', '3', '0352', '114.23435,39.442406', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('238', '229', '140225', '浑源县', '3', '0352', '113.699475,39.693406', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('239', '229', '140226', '左云县', '3', '0352', '112.703008,40.013442', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('240', '229', '140227', '大同县', '3', '0352', '113.61244,40.040294', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('241', '217', '140300', '阳泉市', '2', '0353', '113.580519,37.856971', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('242', '241', '140302', '城区', '3', '0353', '113.600669,37.847436', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('243', '241', '140303', '矿区', '3', '0353', '113.555279,37.868494', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('244', '241', '140311', '郊区', '3', '0353', '113.594163,37.944679', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('245', '241', '140321', '平定县', '3', '0353', '113.630107,37.804988', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('246', '241', '140322', '盂县', '3', '0353', '113.41233,38.085619', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('247', '217', '140400', '长治市', '2', '0355', '113.116404,36.195409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('248', '247', '140402', '城区', '3', '0355', '113.123088,36.20353', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('249', '247', '140411', '郊区', '3', '0355', '113.101211,36.218388', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('250', '247', '140421', '长治县', '3', '0355', '113.051407,36.052858', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('251', '247', '140423', '襄垣县', '3', '0355', '113.051491,36.535817', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('252', '247', '140424', '屯留县', '3', '0355', '112.891998,36.315663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('253', '247', '140425', '平顺县', '3', '0355', '113.435961,36.200179', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('254', '247', '140426', '黎城县', '3', '0355', '113.387155,36.502328', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('255', '247', '140427', '壶关县', '3', '0355', '113.207049,36.115448', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('256', '247', '140428', '长子县', '3', '0355', '112.8779,36.122334', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('257', '247', '140429', '武乡县', '3', '0355', '112.864561,36.837625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('258', '247', '140430', '沁县', '3', '0355', '112.699226,36.756063', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('259', '247', '140431', '沁源县', '3', '0355', '112.337446,36.5002', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('260', '247', '140481', '潞城市', '3', '0355', '113.228852,36.334104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('261', '217', '140500', '晋城市', '2', '0356', '112.851486,35.490684', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('262', '261', '140502', '城区', '3', '0356', '112.853555,35.501571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('263', '261', '140521', '沁水县', '3', '0356', '112.186738,35.690141', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('264', '261', '140522', '阳城县', '3', '0356', '112.414738,35.486029', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('265', '261', '140524', '陵川县', '3', '0356', '113.280688,35.775685', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('266', '261', '140525', '泽州县', '3', '0356', '112.899137,35.617221', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('267', '261', '140581', '高平市', '3', '0356', '112.92392,35.797997', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('268', '217', '140600', '朔州市', '2', '0349', '112.432991,39.331855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('269', '268', '140602', '朔城区', '3', '0349', '112.432312,39.319519', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('270', '268', '140603', '平鲁区', '3', '0349', '112.28833,39.512155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('271', '268', '140621', '山阴县', '3', '0349', '112.816413,39.527893', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('272', '268', '140622', '应县', '3', '0349', '113.191098,39.554247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('273', '268', '140623', '右玉县', '3', '0349', '112.466989,39.989063', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('274', '268', '140624', '怀仁县', '3', '0349', '113.131717,39.821627', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('275', '217', '140700', '晋中市', '2', '0354', '112.752652,37.687357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('276', '275', '140702', '榆次区', '3', '0354', '112.708224,37.697794', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('277', '275', '140721', '榆社县', '3', '0354', '112.975209,37.070916', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('278', '275', '140722', '左权县', '3', '0354', '113.379403,37.082943', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('279', '275', '140723', '和顺县', '3', '0354', '113.570415,37.32957', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('280', '275', '140724', '昔阳县', '3', '0354', '113.706977,37.61253', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('281', '275', '140725', '寿阳县', '3', '0354', '113.176373,37.895191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('282', '275', '140726', '太谷县', '3', '0354', '112.551305,37.421307', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('283', '275', '140727', '祁县', '3', '0354', '112.335542,37.357869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('284', '275', '140728', '平遥县', '3', '0354', '112.176136,37.189421', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('285', '275', '140729', '灵石县', '3', '0354', '111.77864,36.847927', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('286', '275', '140781', '介休市', '3', '0354', '111.916711,37.026944', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('287', '217', '140800', '运城市', '2', '0359', '111.00746,35.026516', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('288', '287', '140802', '盐湖区', '3', '0359', '110.998272,35.015101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('289', '287', '140821', '临猗县', '3', '0359', '110.774547,35.144277', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('290', '287', '140822', '万荣县', '3', '0359', '110.838024,35.415253', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('291', '287', '140823', '闻喜县', '3', '0359', '111.22472,35.356644', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('292', '287', '140824', '稷山县', '3', '0359', '110.983333,35.604025', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('293', '287', '140825', '新绛县', '3', '0359', '111.224734,35.616251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('294', '287', '140826', '绛县', '3', '0359', '111.568236,35.49119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('295', '287', '140827', '垣曲县', '3', '0359', '111.670108,35.297369', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('296', '287', '140828', '夏县', '3', '0359', '111.220456,35.141363', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('297', '287', '140829', '平陆县', '3', '0359', '111.194133,34.82926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('298', '287', '140830', '芮城县', '3', '0359', '110.694369,34.693579', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('299', '287', '140881', '永济市', '3', '0359', '110.447543,34.8671', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('300', '287', '140882', '河津市', '3', '0359', '110.712063,35.596383', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('301', '217', '140900', '忻州市', '2', '0350', '112.734174,38.416663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('302', '301', '140902', '忻府区', '3', '0350', '112.746046,38.404242', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('303', '301', '140921', '定襄县', '3', '0350', '112.957237,38.473506', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('304', '301', '140922', '五台县', '3', '0350', '113.255309,38.728315', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('305', '301', '140923', '代县', '3', '0350', '112.960282,39.066917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('306', '301', '140924', '繁峙县', '3', '0350', '113.265563,39.188811', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('307', '301', '140925', '宁武县', '3', '0350', '112.304722,39.001524', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('308', '301', '140926', '静乐县', '3', '0350', '111.939498,38.359306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('309', '301', '140927', '神池县', '3', '0350', '112.211296,39.090552', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('310', '301', '140928', '五寨县', '3', '0350', '111.846904,38.910726', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('311', '301', '140929', '岢岚县', '3', '0350', '111.57285,38.70418', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('312', '301', '140930', '河曲县', '3', '0350', '111.138472,39.384482', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('313', '301', '140931', '保德县', '3', '0350', '111.086564,39.022487', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('314', '301', '140932', '偏关县', '3', '0350', '111.508831,39.436306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('315', '301', '140981', '原平市', '3', '0350', '112.711058,38.731402', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('316', '217', '141000', '临汾市', '2', '0357', '111.518975,36.088005', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('317', '316', '141002', '尧都区', '3', '0357', '111.579554,36.07884', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('318', '316', '141021', '曲沃县', '3', '0357', '111.47586,35.641086', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('319', '316', '141022', '翼城县', '3', '0357', '111.718951,35.738576', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('320', '316', '141023', '襄汾县', '3', '0357', '111.441725,35.876293', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('321', '316', '141024', '洪洞县', '3', '0357', '111.674965,36.253747', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('322', '316', '141025', '古县', '3', '0357', '111.920465,36.266914', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('323', '316', '141026', '安泽县', '3', '0357', '112.250144,36.147787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('324', '316', '141027', '浮山县', '3', '0357', '111.848883,35.968124', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('325', '316', '141028', '吉县', '3', '0357', '110.681763,36.098188', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('326', '316', '141029', '乡宁县', '3', '0357', '110.847021,35.970389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('327', '316', '141030', '大宁县', '3', '0357', '110.75291,36.465102', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('328', '316', '141031', '隰县', '3', '0357', '110.940637,36.69333', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('329', '316', '141032', '永和县', '3', '0357', '110.632006,36.759507', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('330', '316', '141033', '蒲县', '3', '0357', '111.096439,36.411826', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('331', '316', '141034', '汾西县', '3', '0357', '111.56395,36.652854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('332', '316', '141081', '侯马市', '3', '0357', '111.372002,35.619105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('333', '316', '141082', '霍州市', '3', '0357', '111.755398,36.56893', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('334', '217', '141100', '吕梁市', '2', '0358', '111.144699,37.519126', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('335', '334', '141102', '离石区', '3', '0358', '111.150695,37.51786', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('336', '334', '141121', '文水县', '3', '0358', '112.028866,37.438101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('337', '334', '141122', '交城县', '3', '0358', '112.156064,37.551963', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('338', '334', '141123', '兴县', '3', '0358', '111.127667,38.462389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('339', '334', '141124', '临县', '3', '0358', '110.992093,37.950758', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('340', '334', '141125', '柳林县', '3', '0358', '110.889007,37.429772', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('341', '334', '141126', '石楼县', '3', '0358', '110.834634,36.99857', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('342', '334', '141127', '岚县', '3', '0358', '111.671917,38.279299', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('343', '334', '141128', '方山县', '3', '0358', '111.244098,37.894631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('344', '334', '141129', '中阳县', '3', '0358', '111.179657,37.357058', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('345', '334', '141130', '交口县', '3', '0358', '111.181151,36.982186', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('346', '334', '141181', '孝义市', '3', '0358', '111.778818,37.146294', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('347', '334', '141182', '汾阳市', '3', '0358', '111.770477,37.261756', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('348', '-1', '150000', '内蒙古自治区', '1', '[]', '111.76629,40.81739', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('349', '348', '150100', '呼和浩特市', '2', '0471', '111.749995,40.842356', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('350', '349', '150102', '新城区', '3', '0471', '111.665544,40.858289', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('351', '349', '150103', '回民区', '3', '0471', '111.623692,40.808608', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('352', '349', '150104', '玉泉区', '3', '0471', '111.673881,40.753655', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('353', '349', '150105', '赛罕区', '3', '0471', '111.701355,40.792667', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('354', '349', '150121', '土默特左旗', '3', '0471', '111.163902,40.729572', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('355', '349', '150122', '托克托县', '3', '0471', '111.194312,40.277431', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('356', '349', '150123', '和林格尔县', '3', '0471', '111.821843,40.378787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('357', '349', '150124', '清水河县', '3', '0471', '111.647609,39.921095', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('358', '349', '150125', '武川县', '3', '0471', '111.451303,41.096471', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('359', '348', '150200', '包头市', '2', '0472', '109.953504,40.621157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('360', '359', '150202', '东河区', '3', '0472', '110.044106,40.576319', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('361', '359', '150203', '昆都仑区', '3', '0472', '109.837707,40.642578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('362', '359', '150204', '青山区', '3', '0472', '109.901572,40.643246', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('363', '359', '150205', '石拐区', '3', '0472', '110.060254,40.681748', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('364', '359', '150206', '白云鄂博矿区', '3', '0472', '109.973803,41.769511', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('365', '359', '150207', '九原区', '3', '0472', '109.967449,40.610561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('366', '359', '150221', '土默特右旗', '3', '0472', '110.524262,40.569426', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('367', '359', '150222', '固阳县', '3', '0472', '110.060514,41.034105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('368', '359', '150223', '达尔罕茂明安联合旗', '3', '0472', '110.432626,41.698992', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('369', '348', '150300', '乌海市', '2', '0473', '106.794216,39.655248', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('370', '369', '150302', '海勃湾区', '3', '0473', '106.822778,39.691156', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('371', '369', '150303', '海南区', '3', '0473', '106.891424,39.441364', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('372', '369', '150304', '乌达区', '3', '0473', '106.726099,39.505925', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('373', '348', '150400', '赤峰市', '2', '0476', '118.88694,42.257843', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('374', '373', '150402', '红山区', '3', '0476', '118.953854,42.296588', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('375', '373', '150403', '元宝山区', '3', '0476', '119.288611,42.038902', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('376', '373', '150404', '松山区', '3', '0476', '118.916208,42.299798', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('377', '373', '150421', '阿鲁科尔沁旗', '3', '0476', '120.0657,43.872298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('378', '373', '150422', '巴林左旗', '3', '0476', '119.362931,43.960889', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('379', '373', '150423', '巴林右旗', '3', '0476', '118.66518,43.534414', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('380', '373', '150424', '林西县', '3', '0476', '118.05545,43.61812', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('381', '373', '150425', '克什克腾旗', '3', '0476', '117.545797,43.264988', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('382', '373', '150426', '翁牛特旗', '3', '0476', '119.00658,42.936188', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('383', '373', '150428', '喀喇沁旗', '3', '0476', '118.701937,41.927363', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('384', '373', '150429', '宁城县', '3', '0476', '119.318876,41.601375', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('385', '373', '150430', '敖汉旗', '3', '0476', '119.921603,42.290781', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('386', '348', '150500', '通辽市', '2', '0475', '122.243444,43.652889', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('387', '386', '150502', '科尔沁区', '3', '0475', '122.255671,43.623078', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('388', '386', '150521', '科尔沁左翼中旗', '3', '0475', '123.312264,44.126625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('389', '386', '150522', '科尔沁左翼后旗', '3', '0475', '122.35677,42.935105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('390', '386', '150523', '开鲁县', '3', '0475', '121.319308,43.601244', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('391', '386', '150524', '库伦旗', '3', '0475', '121.8107,42.735656', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('392', '386', '150525', '奈曼旗', '3', '0475', '120.658282,42.867226', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('393', '386', '150526', '扎鲁特旗', '3', '0475', '120.911676,44.556389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('394', '386', '150581', '霍林郭勒市', '3', '0475', '119.68187,45.533962', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('395', '348', '150600', '鄂尔多斯市', '2', '0477', '109.781327,39.608266', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('396', '395', '150602', '东胜区', '3', '0477', '109.963333,39.822593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('397', '395', '150603', '康巴什区', '3', '0477', '109.790076,39.607472', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('398', '395', '150621', '达拉特旗', '3', '0477', '110.033833,40.412438', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('399', '395', '150622', '准格尔旗', '3', '0477', '111.240171,39.864361', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('400', '395', '150623', '鄂托克前旗', '3', '0477', '107.477514,38.182362', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('401', '395', '150624', '鄂托克旗', '3', '0477', '107.97616,39.08965', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('402', '395', '150625', '杭锦旗', '3', '0477', '108.736208,39.833309', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('403', '395', '150626', '乌审旗', '3', '0477', '108.817607,38.604136', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('404', '395', '150627', '伊金霍洛旗', '3', '0477', '109.74774,39.564659', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('405', '348', '150700', '呼伦贝尔市', '2', '0470', '119.765558,49.211576', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('406', '405', '150702', '海拉尔区', '3', '0470', '119.736176,49.212188', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('407', '405', '150703', '扎赉诺尔区', '3', '0470', '117.670248,49.510375', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('408', '405', '150721', '阿荣旗', '3', '0470', '123.459049,48.126584', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('409', '405', '150722', '莫力达瓦达斡尔族自治旗', '3', '0470', '124.519023,48.477728', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('410', '405', '150723', '鄂伦春自治旗', '3', '0470', '123.726201,50.591842', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('411', '405', '150724', '鄂温克族自治旗', '3', '0470', '119.755239,49.146592', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('412', '405', '150725', '陈巴尔虎旗', '3', '0470', '119.424026,49.328916', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('413', '405', '150726', '新巴尔虎左旗', '3', '0470', '118.269819,48.218241', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('414', '405', '150727', '新巴尔虎右旗', '3', '0470', '116.82369,48.672101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('415', '405', '150781', '满洲里市', '3', '0470', '117.378529,49.597841', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('416', '405', '150782', '牙克石市', '3', '0470', '120.711775,49.285629', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('417', '405', '150783', '扎兰屯市', '3', '0470', '122.737467,48.013733', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('418', '405', '150784', '额尔古纳市', '3', '0470', '120.180506,50.243102', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('419', '405', '150785', '根河市', '3', '0470', '121.520388,50.780344', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('420', '348', '150800', '巴彦淖尔市', '2', '0478', '107.387657,40.743213', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('421', '420', '150802', '临河区', '3', '0478', '107.363918,40.751187', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('422', '420', '150821', '五原县', '3', '0478', '108.267561,41.088421', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('423', '420', '150822', '磴口县', '3', '0478', '107.008248,40.330523', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('424', '420', '150823', '乌拉特前旗', '3', '0478', '108.652114,40.737018', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('425', '420', '150824', '乌拉特中旗', '3', '0478', '108.513645,41.587732', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('426', '420', '150825', '乌拉特后旗', '3', '0478', '107.074621,41.084282', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('427', '420', '150826', '杭锦后旗', '3', '0478', '107.151245,40.88602', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('428', '348', '150900', '乌兰察布市', '2', '0474', '113.132584,40.994785', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('429', '428', '150902', '集宁区', '3', '0474', '113.116453,41.034134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('430', '428', '150921', '卓资县', '3', '0474', '112.577528,40.894691', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('431', '428', '150922', '化德县', '3', '0474', '114.010437,41.90456', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('432', '428', '150923', '商都县', '3', '0474', '113.577816,41.562113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('433', '428', '150924', '兴和县', '3', '0474', '113.834173,40.872301', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('434', '428', '150925', '凉城县', '3', '0474', '112.503971,40.531555', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('435', '428', '150926', '察哈尔右翼前旗', '3', '0474', '113.214733,40.785631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('436', '428', '150927', '察哈尔右翼中旗', '3', '0474', '112.635577,41.277462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('437', '428', '150928', '察哈尔右翼后旗', '3', '0474', '113.191035,41.436069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('438', '428', '150929', '四子王旗', '3', '0474', '111.706617,41.533462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('439', '428', '150981', '丰镇市', '3', '0474', '113.109892,40.436983', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('440', '348', '152200', '兴安盟', '2', '0482', '122.037657,46.082462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('441', '440', '152201', '乌兰浩特市', '3', '0482', '122.093123,46.072731', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('442', '440', '152202', '阿尔山市', '3', '0482', '119.943575,47.17744', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('443', '440', '152221', '科尔沁右翼前旗', '3', '0482', '121.952621,46.079833', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('444', '440', '152222', '科尔沁右翼中旗', '3', '0482', '121.47653,45.060837', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('445', '440', '152223', '扎赉特旗', '3', '0482', '122.899656,46.723237', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('446', '440', '152224', '突泉县', '3', '0482', '121.593799,45.38193', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('447', '348', '152500', '锡林郭勒盟', '2', '0479', '116.048222,43.933454', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('448', '447', '152501', '二连浩特市', '3', '0479', '111.951002,43.6437', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('449', '447', '152502', '锡林浩特市', '3', '0479', '116.086029,43.933403', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('450', '447', '152522', '阿巴嘎旗', '3', '0479', '114.950248,44.022995', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('451', '447', '152523', '苏尼特左旗', '3', '0479', '113.667248,43.85988', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('452', '447', '152524', '苏尼特右旗', '3', '0479', '112.641783,42.742892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('453', '447', '152525', '东乌珠穆沁旗', '3', '0479', '116.974494,45.498221', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('454', '447', '152526', '西乌珠穆沁旗', '3', '0479', '117.608911,44.587882', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('455', '447', '152527', '太仆寺旗', '3', '0479', '115.282986,41.877135', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('456', '447', '152528', '镶黄旗', '3', '0479', '113.847287,42.232371', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('457', '447', '152529', '正镶白旗', '3', '0479', '115.029848,42.28747', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('458', '447', '152530', '正蓝旗', '3', '0479', '115.99247,42.241638', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('459', '447', '152531', '多伦县', '3', '0479', '116.485555,42.203591', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('460', '348', '152900', '阿拉善盟', '2', '0483', '105.728957,38.851921', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('461', '460', '152921', '阿拉善左旗', '3', '0483', '105.666275,38.833389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('462', '460', '152922', '阿拉善右旗', '3', '0483', '101.666917,39.216185', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('463', '460', '152923', '额济纳旗', '3', '0483', '101.055731,41.95455', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('464', '-1', '210000', '辽宁省', '1', '[]', '123.431382,41.836175', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('465', '464', '210100', '沈阳市', '2', '024', '123.465035,41.677284', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('466', '465', '210102', '和平区', '3', '024', '123.420368,41.789833', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('467', '465', '210103', '沈河区', '3', '024', '123.458691,41.796177', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('468', '465', '210104', '大东区', '3', '024', '123.469948,41.805137', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('469', '465', '210105', '皇姑区', '3', '024', '123.442378,41.824516', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('470', '465', '210106', '铁西区', '3', '024', '123.333968,41.820807', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('471', '465', '210111', '苏家屯区', '3', '024', '123.344062,41.664757', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('472', '465', '210112', '浑南区', '3', '024', '123.449714,41.714914', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('473', '465', '210113', '沈北新区', '3', '024', '123.583196,41.912487', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('474', '465', '210114', '于洪区', '3', '024', '123.308119,41.793721', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('475', '465', '210115', '辽中区', '3', '024', '122.765409,41.516826', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('476', '465', '210123', '康平县', '3', '024', '123.343699,42.72793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('477', '465', '210124', '法库县', '3', '024', '123.440294,42.50108', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('478', '465', '210181', '新民市', '3', '024', '122.836723,41.985186', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('479', '464', '210200', '大连市', '2', '0411', '121.614848,38.914086', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('480', '479', '210202', '中山区', '3', '0411', '121.644926,38.918574', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('481', '479', '210203', '西岗区', '3', '0411', '121.612324,38.914687', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('482', '479', '210204', '沙河口区', '3', '0411', '121.594297,38.904788', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('483', '479', '210211', '甘井子区', '3', '0411', '121.525466,38.953343', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('484', '479', '210212', '旅顺口区', '3', '0411', '121.261953,38.851705', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('485', '479', '210213', '金州区', '3', '0411', '121.782655,39.050001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('486', '479', '210214', '普兰店区', '3', '0411', '121.938269,39.392095', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('487', '479', '210224', '长海县', '3', '0411', '122.588494,39.272728', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('488', '479', '210281', '瓦房店市', '3', '0411', '121.979543,39.626897', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('489', '479', '210283', '庄河市', '3', '0411', '122.967424,39.680843', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('490', '464', '210300', '鞍山市', '2', '0412', '122.994329,41.108647', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('491', '490', '210302', '铁东区', '3', '0412', '122.991052,41.089933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('492', '490', '210303', '铁西区', '3', '0412', '122.969629,41.119884', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('493', '490', '210304', '立山区', '3', '0412', '123.029091,41.150401', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('494', '490', '210311', '千山区', '3', '0412', '122.944751,41.068901', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('495', '490', '210321', '台安县', '3', '0412', '122.436196,41.412767', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('496', '490', '210323', '岫岩满族自治县', '3', '0412', '123.280935,40.29088', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('497', '490', '210381', '海城市', '3', '0412', '122.685217,40.882377', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('498', '464', '210400', '抚顺市', '2', '0413', '123.957208,41.880872', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('499', '498', '210402', '新抚区', '3', '0413', '123.912872,41.862026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('500', '498', '210403', '东洲区', '3', '0413', '124.038685,41.853191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('501', '498', '210404', '望花区', '3', '0413', '123.784225,41.853641', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('502', '498', '210411', '顺城区', '3', '0413', '123.945075,41.883235', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('503', '498', '210421', '抚顺县', '3', '0413', '124.097978,41.922644', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('504', '498', '210422', '新宾满族自治县', '3', '0413', '125.039978,41.734256', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('505', '498', '210423', '清原满族自治县', '3', '0413', '124.924083,42.100538', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('506', '464', '210500', '本溪市', '2', '0414', '123.685142,41.486981', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('507', '506', '210502', '平山区', '3', '0414', '123.769088,41.299587', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('508', '506', '210503', '溪湖区', '3', '0414', '123.767646,41.329219', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('509', '506', '210504', '明山区', '3', '0414', '123.817214,41.308719', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('510', '506', '210505', '南芬区', '3', '0414', '123.744802,41.100445', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('511', '506', '210521', '本溪满族自治县', '3', '0414', '124.120635,41.302009', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('512', '506', '210522', '桓仁满族自治县', '3', '0414', '125.361007,41.267127', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('513', '464', '210600', '丹东市', '2', '0415', '124.35445,40.000787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('514', '513', '210602', '元宝区', '3', '0415', '124.395661,40.136434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('515', '513', '210603', '振兴区', '3', '0415', '124.383237,40.129944', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('516', '513', '210604', '振安区', '3', '0415', '124.470034,40.201553', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('517', '513', '210624', '宽甸满族自治县', '3', '0415', '124.783659,40.731316', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('518', '513', '210681', '东港市', '3', '0415', '124.152705,39.863008', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('519', '513', '210682', '凤城市', '3', '0415', '124.066919,40.452297', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('520', '464', '210700', '锦州市', '2', '0416', '121.126846,41.095685', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('521', '520', '210702', '古塔区', '3', '0416', '121.128279,41.117245', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('522', '520', '210703', '凌河区', '3', '0416', '121.150877,41.114989', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('523', '520', '210711', '太和区', '3', '0416', '121.103892,41.109147', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('524', '520', '210726', '黑山县', '3', '0416', '122.126292,41.653593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('525', '520', '210727', '义县', '3', '0416', '121.23908,41.533086', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('526', '520', '210781', '凌海市', '3', '0416', '121.35549,41.160567', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('527', '520', '210782', '北镇市', '3', '0416', '121.777395,41.58844', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('528', '464', '210800', '营口市', '2', '0417', '122.219458,40.625364', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('529', '528', '210802', '站前区', '3', '0417', '122.259033,40.672563', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('530', '528', '210803', '西市区', '3', '0417', '122.206419,40.666213', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('531', '528', '210804', '鲅鱼圈区', '3', '0417', '122.121521,40.226661', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('532', '528', '210811', '老边区', '3', '0417', '122.380087,40.680191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('533', '528', '210881', '盖州市', '3', '0417', '122.349012,40.40074', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('534', '528', '210882', '大石桥市', '3', '0417', '122.509006,40.644482', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('535', '464', '210900', '阜新市', '2', '0418', '121.670273,42.021602', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('536', '535', '210902', '海州区', '3', '0418', '121.657638,42.011162', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('537', '535', '210903', '新邱区', '3', '0418', '121.792535,42.087632', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('538', '535', '210904', '太平区', '3', '0418', '121.678604,42.010669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('539', '535', '210905', '清河门区', '3', '0418', '121.416105,41.7831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('540', '535', '210911', '细河区', '3', '0418', '121.68054,42.025494', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('541', '535', '210921', '阜新蒙古族自治县', '3', '0418', '121.757901,42.065175', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('542', '535', '210922', '彰武县', '3', '0418', '122.538793,42.386543', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('543', '464', '211000', '辽阳市', '2', '0419', '123.236974,41.267794', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('544', '543', '211002', '白塔区', '3', '0419', '123.174325,41.270347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('545', '543', '211003', '文圣区', '3', '0419', '123.231408,41.283754', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('546', '543', '211004', '宏伟区', '3', '0419', '123.196672,41.217649', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('547', '543', '211005', '弓长岭区', '3', '0419', '123.419803,41.151847', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('548', '543', '211011', '太子河区', '3', '0419', '123.18144,41.295023', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('549', '543', '211021', '辽阳县', '3', '0419', '123.105694,41.205329', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('550', '543', '211081', '灯塔市', '3', '0419', '123.339312,41.426372', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('551', '464', '211100', '盘锦市', '2', '0427', '122.170584,40.719847', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('552', '551', '211102', '双台子区', '3', '0427', '122.039787,41.19965', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('553', '551', '211103', '兴隆台区', '3', '0427', '122.070769,41.119898', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('554', '551', '211104', '大洼区', '3', '0427', '122.082574,41.002279', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('555', '551', '211122', '盘山县', '3', '0427', '121.996411,41.242639', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('556', '464', '211200', '铁岭市', '2', '0410', '123.726035,42.223828', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('557', '556', '211202', '银州区', '3', '0410', '123.842305,42.286129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('558', '556', '211204', '清河区', '3', '0410', '124.159191,42.546565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('559', '556', '211221', '铁岭县', '3', '0410', '123.728933,42.223395', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('560', '556', '211223', '西丰县', '3', '0410', '124.727392,42.73803', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('561', '556', '211224', '昌图县', '3', '0410', '124.111099,42.785791', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('562', '556', '211281', '调兵山市', '3', '0410', '123.567117,42.467521', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('563', '556', '211282', '开原市', '3', '0410', '124.038268,42.546307', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('564', '464', '211300', '朝阳市', '2', '0421', '120.450879,41.573762', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('565', '564', '211302', '双塔区', '3', '0421', '120.453744,41.565627', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('566', '564', '211303', '龙城区', '3', '0421', '120.413376,41.576749', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('567', '564', '211321', '朝阳县', '3', '0421', '120.389754,41.497825', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('568', '564', '211322', '建平县', '3', '0421', '119.64328,41.403128', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('569', '564', '211324', '喀喇沁左翼蒙古族自治县', '3', '0421', '119.741223,41.12815', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('570', '564', '211381', '北票市', '3', '0421', '120.77073,41.800683', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('571', '564', '211382', '凌源市', '3', '0421', '119.401574,41.245445', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('572', '464', '211400', '葫芦岛市', '2', '0429', '120.836939,40.71104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('573', '572', '211402', '连山区', '3', '0429', '120.869231,40.774461', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('574', '572', '211403', '龙港区', '3', '0429', '120.893786,40.735519', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('575', '572', '211404', '南票区', '3', '0429', '120.749727,41.107107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('576', '572', '211421', '绥中县', '3', '0429', '120.344311,40.32558', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('577', '572', '211422', '建昌县', '3', '0429', '119.837124,40.824367', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('578', '572', '211481', '兴城市', '3', '0429', '120.756479,40.609731', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('579', '-1', '220000', '吉林省', '1', '[]', '125.32568,43.897016', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('580', '579', '220100', '长春市', '2', '0431', '125.323513,43.817251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('581', '580', '220102', '南关区', '3', '0431', '125.350173,43.863989', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('582', '580', '220103', '宽城区', '3', '0431', '125.326581,43.943612', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('583', '580', '220104', '朝阳区', '3', '0431', '125.288254,43.833762', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('584', '580', '220105', '二道区', '3', '0431', '125.374327,43.865577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('585', '580', '220106', '绿园区', '3', '0431', '125.256135,43.880975', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('586', '580', '220112', '双阳区', '3', '0431', '125.664662,43.525311', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('587', '580', '220113', '九台区', '3', '0431', '125.839573,44.151742', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('588', '580', '220122', '农安县', '3', '0431', '125.184887,44.432763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('589', '580', '220182', '榆树市', '3', '0431', '126.533187,44.840318', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('590', '580', '220183', '德惠市', '3', '0431', '125.728755,44.522056', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('591', '579', '220200', '吉林市', '2', '0432', '126.549572,43.837883', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('592', '591', '220202', '昌邑区', '3', '0432', '126.574709,43.881818', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('593', '591', '220203', '龙潭区', '3', '0432', '126.562197,43.910802', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('594', '591', '220204', '船营区', '3', '0432', '126.540966,43.833445', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('595', '591', '220211', '丰满区', '3', '0432', '126.562274,43.821601', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('596', '591', '220221', '永吉县', '3', '0432', '126.497741,43.672582', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('597', '591', '220281', '蛟河市', '3', '0432', '127.344229,43.724007', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('598', '591', '220282', '桦甸市', '3', '0432', '126.746309,42.972096', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('599', '591', '220283', '舒兰市', '3', '0432', '126.965607,44.406105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('600', '591', '220284', '磐石市', '3', '0432', '126.060427,42.946285', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('601', '579', '220300', '四平市', '2', '0434', '124.350398,43.166419', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('602', '601', '220302', '铁西区', '3', '0434', '124.345722,43.146155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('603', '601', '220303', '铁东区', '3', '0434', '124.409591,43.162105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('604', '601', '220322', '梨树县', '3', '0434', '124.33539,43.30706', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('605', '601', '220323', '伊通满族自治县', '3', '0434', '125.305393,43.345754', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('606', '601', '220381', '公主岭市', '3', '0434', '124.822929,43.504676', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('607', '601', '220382', '双辽市', '3', '0434', '123.502723,43.518302', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('608', '579', '220400', '辽源市', '2', '0437', '125.14366,42.887766', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('609', '608', '220402', '龙山区', '3', '0437', '125.136627,42.90158', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('610', '608', '220403', '西安区', '3', '0437', '125.149281,42.927324', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('611', '608', '220421', '东丰县', '3', '0437', '125.531021,42.677371', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('612', '608', '220422', '东辽县', '3', '0437', '124.991424,42.92625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('613', '579', '220500', '通化市', '2', '0435', '125.939697,41.728401', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('614', '613', '220502', '东昌区', '3', '0435', '125.927101,41.702859', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('615', '613', '220503', '二道江区', '3', '0435', '126.042678,41.774044', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('616', '613', '220521', '通化县', '3', '0435', '125.759259,41.679808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('617', '613', '220523', '辉南县', '3', '0435', '126.046783,42.684921', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('618', '613', '220524', '柳河县', '3', '0435', '125.744735,42.284605', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('619', '613', '220581', '梅河口市', '3', '0435', '125.710859,42.539253', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('620', '613', '220582', '集安市', '3', '0435', '126.19403,41.125307', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('621', '579', '220600', '白山市', '2', '0439', '126.41473,41.943972', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('622', '621', '220602', '浑江区', '3', '0439', '126.416093,41.945409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('623', '621', '220605', '江源区', '3', '0439', '126.591178,42.056747', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('624', '621', '220621', '抚松县', '3', '0439', '127.449763,42.221207', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('625', '621', '220622', '靖宇县', '3', '0439', '126.813583,42.388896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('626', '621', '220623', '长白朝鲜族自治县', '3', '0439', '128.200789,41.420018', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('627', '621', '220681', '临江市', '3', '0439', '126.918087,41.811979', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('628', '579', '220700', '松原市', '2', '0438', '124.825042,45.141548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('629', '628', '220702', '宁江区', '3', '0438', '124.86562,45.209915', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('630', '628', '220721', '前郭尔罗斯蒙古族自治县', '3', '0438', '124.823417,45.118061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('631', '628', '220722', '长岭县', '3', '0438', '123.967483,44.275895', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('632', '628', '220723', '乾安县', '3', '0438', '124.041139,45.003773', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('633', '628', '220781', '扶余市', '3', '0438', '126.049803,44.9892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('634', '579', '220800', '白城市', '2', '0436', '122.838714,45.619884', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('635', '634', '220802', '洮北区', '3', '0436', '122.851029,45.621716', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('636', '634', '220821', '镇赉县', '3', '0436', '123.199607,45.84835', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('637', '634', '220822', '通榆县', '3', '0436', '123.088238,44.81291', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('638', '634', '220881', '洮南市', '3', '0436', '122.798579,45.356807', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('639', '634', '220882', '大安市', '3', '0436', '124.292626,45.506996', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('640', '579', '222400', '延边朝鲜族自治州', '2', '1433', '129.471868,42.909408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('641', '640', '222401', '延吉市', '3', '1433', '129.508804,42.89125', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('642', '640', '222402', '图们市', '3', '1433', '129.84371,42.968044', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('643', '640', '222403', '敦化市', '3', '1433', '128.232131,43.372642', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('644', '640', '222404', '珲春市', '3', '1433', '130.366036,42.862821', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('645', '640', '222405', '龙井市', '3', '1433', '129.427066,42.76631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('646', '640', '222406', '和龙市', '3', '1433', '129.010106,42.546675', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('647', '640', '222424', '汪清县', '3', '1433', '129.771607,43.312522', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('648', '640', '222426', '安图县', '3', '1433', '128.899772,43.11195', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('649', '-1', '230000', '黑龙江省', '1', '[]', '126.661665,45.742366', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('650', '649', '230100', '哈尔滨市', '2', '0451', '126.534967,45.803775', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('651', '650', '230102', '道里区', '3', '0451', '126.616973,45.75577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('652', '650', '230103', '南岗区', '3', '0451', '126.668784,45.760174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('653', '650', '230104', '道外区', '3', '0451', '126.64939,45.792057', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('654', '650', '230108', '平房区', '3', '0451', '126.637611,45.597911', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('655', '650', '230109', '松北区', '3', '0451', '126.516914,45.794504', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('656', '650', '230110', '香坊区', '3', '0451', '126.662593,45.707716', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('657', '650', '230111', '呼兰区', '3', '0451', '126.587905,45.889457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('658', '650', '230112', '阿城区', '3', '0451', '126.958098,45.548669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('659', '650', '230113', '双城区', '3', '0451', '126.312624,45.383218', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('660', '650', '230123', '依兰县', '3', '0451', '129.567877,46.325419', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('661', '650', '230124', '方正县', '3', '0451', '128.829536,45.851694', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('662', '650', '230125', '宾县', '3', '0451', '127.466634,45.745917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('663', '650', '230126', '巴彦县', '3', '0451', '127.403781,46.086549', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('664', '650', '230127', '木兰县', '3', '0451', '128.043466,45.950582', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('665', '650', '230128', '通河县', '3', '0451', '128.746124,45.990205', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('666', '650', '230129', '延寿县', '3', '0451', '128.331643,45.451897', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('667', '650', '230183', '尚志市', '3', '0451', '128.009894,45.209586', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('668', '650', '230184', '五常市', '3', '0451', '127.167618,44.931991', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('669', '649', '230200', '齐齐哈尔市', '2', '0452', '123.918186,47.354348', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('670', '669', '230202', '龙沙区', '3', '0452', '123.957531,47.317308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('671', '669', '230203', '建华区', '3', '0452', '123.955464,47.354364', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('672', '669', '230204', '铁锋区', '3', '0452', '123.978293,47.340517', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('673', '669', '230205', '昂昂溪区', '3', '0452', '123.8224,47.15516', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('674', '669', '230206', '富拉尔基区', '3', '0452', '123.629189,47.208843', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('675', '669', '230207', '碾子山区', '3', '0452', '122.887775,47.516872', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('676', '669', '230208', '梅里斯达斡尔族区', '3', '0452', '123.75291,47.309537', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('677', '669', '230221', '龙江县', '3', '0452', '123.205323,47.338665', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('678', '669', '230223', '依安县', '3', '0452', '125.306278,47.893548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('679', '669', '230224', '泰来县', '3', '0452', '123.416631,46.393694', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('680', '669', '230225', '甘南县', '3', '0452', '123.507429,47.922405', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('681', '669', '230227', '富裕县', '3', '0452', '124.473793,47.774347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('682', '669', '230229', '克山县', '3', '0452', '125.875705,48.037031', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('683', '669', '230230', '克东县', '3', '0452', '126.24872,48.04206', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('684', '669', '230231', '拜泉县', '3', '0452', '126.100213,47.595851', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('685', '669', '230281', '讷河市', '3', '0452', '124.88287,48.466592', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('686', '649', '230300', '鸡西市', '2', '0467', '130.969333,45.295075', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('687', '686', '230302', '鸡冠区', '3', '0467', '130.981185,45.304355', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('688', '686', '230303', '恒山区', '3', '0467', '130.904963,45.210668', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('689', '686', '230304', '滴道区', '3', '0467', '130.843613,45.348763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('690', '686', '230305', '梨树区', '3', '0467', '130.69699,45.092046', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('691', '686', '230306', '城子河区', '3', '0467', '131.011304,45.33697', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('692', '686', '230307', '麻山区', '3', '0467', '130.478187,45.212088', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('693', '686', '230321', '鸡东县', '3', '0467', '131.124079,45.260412', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('694', '686', '230381', '虎林市', '3', '0467', '132.93721,45.762685', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('695', '686', '230382', '密山市', '3', '0467', '131.846635,45.529774', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('696', '649', '230400', '鹤岗市', '2', '0468', '130.297943,47.350189', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('697', '696', '230402', '向阳区', '3', '0468', '130.294235,47.342468', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('698', '696', '230403', '工农区', '3', '0468', '130.274684,47.31878', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('699', '696', '230404', '南山区', '3', '0468', '130.286788,47.315174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('700', '696', '230405', '兴安区', '3', '0468', '130.239245,47.252849', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('701', '696', '230406', '东山区', '3', '0468', '130.317002,47.338537', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('702', '696', '230407', '兴山区', '3', '0468', '130.303481,47.357702', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('703', '696', '230421', '萝北县', '3', '0468', '130.85155,47.576444', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('704', '696', '230422', '绥滨县', '3', '0468', '131.852759,47.289115', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('705', '649', '230500', '双鸭山市', '2', '0469', '131.141195,46.676418', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('706', '705', '230502', '尖山区', '3', '0469', '131.158415,46.64635', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('707', '705', '230503', '岭东区', '3', '0469', '131.164723,46.592721', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('708', '705', '230505', '四方台区', '3', '0469', '131.337592,46.597264', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('709', '705', '230506', '宝山区', '3', '0469', '131.401589,46.577167', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('710', '705', '230521', '集贤县', '3', '0469', '131.141311,46.728412', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('711', '705', '230522', '友谊县', '3', '0469', '131.808063,46.767299', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('712', '705', '230523', '宝清县', '3', '0469', '132.196853,46.327457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('713', '705', '230524', '饶河县', '3', '0469', '134.013872,46.798163', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('714', '649', '230600', '大庆市', '2', '0459', '125.103784,46.589309', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('715', '714', '230602', '萨尔图区', '3', '0459', '125.135591,46.629092', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('716', '714', '230603', '龙凤区', '3', '0459', '125.135326,46.562247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('717', '714', '230604', '让胡路区', '3', '0459', '124.870596,46.652357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('718', '714', '230605', '红岗区', '3', '0459', '124.891039,46.398418', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('719', '714', '230606', '大同区', '3', '0459', '124.812364,46.039827', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('720', '714', '230621', '肇州县', '3', '0459', '125.268643,45.699066', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('721', '714', '230622', '肇源县', '3', '0459', '125.078223,45.51932', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('722', '714', '230623', '林甸县', '3', '0459', '124.863603,47.171717', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('723', '714', '230624', '杜尔伯特蒙古族自治县', '3', '0459', '124.442572,46.862817', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('724', '649', '230700', '伊春市', '2', '0458', '128.841125,47.727535', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('725', '724', '230702', '伊春区', '3', '0458', '128.907257,47.728237', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('726', '724', '230703', '南岔区', '3', '0458', '129.283467,47.138034', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('727', '724', '230704', '友好区', '3', '0458', '128.836291,47.841032', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('728', '724', '230705', '西林区', '3', '0458', '129.312851,47.480735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('729', '724', '230706', '翠峦区', '3', '0458', '128.669754,47.726394', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('730', '724', '230707', '新青区', '3', '0458', '129.533599,48.290455', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('731', '724', '230708', '美溪区', '3', '0458', '129.129314,47.63509', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('732', '724', '230709', '金山屯区', '3', '0458', '129.429117,47.413074', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('733', '724', '230710', '五营区', '3', '0458', '129.245343,48.10791', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('734', '724', '230711', '乌马河区', '3', '0458', '128.799477,47.727687', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('735', '724', '230712', '汤旺河区', '3', '0458', '129.571108,48.454651', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('736', '724', '230713', '带岭区', '3', '0458', '129.020888,47.028379', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('737', '724', '230714', '乌伊岭区', '3', '0458', '129.43792,48.590322', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('738', '724', '230715', '红星区', '3', '0458', '129.390983,48.239431', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('739', '724', '230716', '上甘岭区', '3', '0458', '129.02426,47.974707', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('740', '724', '230722', '嘉荫县', '3', '0458', '130.403134,48.888972', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('741', '724', '230781', '铁力市', '3', '0458', '128.032424,46.986633', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('742', '649', '230800', '佳木斯市', '2', '0454', '130.318878,46.799777', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('743', '742', '230803', '向阳区', '3', '0454', '130.365346,46.80779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('744', '742', '230804', '前进区', '3', '0454', '130.375062,46.814102', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('745', '742', '230805', '东风区', '3', '0454', '130.403664,46.822571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('746', '742', '230811', '郊区', '3', '0454', '130.327194,46.810085', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('747', '742', '230822', '桦南县', '3', '0454', '130.553343,46.239184', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('748', '742', '230826', '桦川县', '3', '0454', '130.71908,47.023001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('749', '742', '230828', '汤原县', '3', '0454', '129.905072,46.730706', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('750', '742', '230881', '同江市', '3', '0454', '132.510919,47.642707', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('751', '742', '230882', '富锦市', '3', '0454', '132.037686,47.250107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('752', '742', '230883', '抚远市', '3', '0454', '134.307884,48.364687', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('753', '649', '230900', '七台河市', '2', '0464', '131.003082,45.771396', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('754', '753', '230902', '新兴区', '3', '0464', '130.932143,45.81593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('755', '753', '230903', '桃山区', '3', '0464', '131.020202,45.765705', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('756', '753', '230904', '茄子河区', '3', '0464', '131.068075,45.785215', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('757', '753', '230921', '勃利县', '3', '0464', '130.59217,45.755063', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('758', '649', '231000', '牡丹江市', '2', '0453', '129.633168,44.551653', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('759', '758', '231002', '东安区', '3', '0453', '129.626641,44.58136', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('760', '758', '231003', '阳明区', '3', '0453', '129.635615,44.596104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('761', '758', '231004', '爱民区', '3', '0453', '129.591537,44.596042', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('762', '758', '231005', '西安区', '3', '0453', '129.616058,44.577625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('763', '758', '231025', '林口县', '3', '0453', '130.284033,45.278046', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('764', '758', '231081', '绥芬河市', '3', '0453', '131.152545,44.412308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('765', '758', '231083', '海林市', '3', '0453', '129.380481,44.594213', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('766', '758', '231084', '宁安市', '3', '0453', '129.482851,44.34072', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('767', '758', '231085', '穆棱市', '3', '0453', '130.524436,44.918813', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('768', '758', '231086', '东宁市', '3', '0453', '131.122915,44.087585', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('769', '649', '231100', '黑河市', '2', '0456', '127.528293,50.245129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('770', '769', '231102', '爱辉区', '3', '0456', '127.50045,50.252105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('771', '769', '231121', '嫩江县', '3', '0456', '125.221192,49.185766', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('772', '769', '231123', '逊克县', '3', '0456', '128.478749,49.564252', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('773', '769', '231124', '孙吴县', '3', '0456', '127.336303,49.425647', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('774', '769', '231181', '北安市', '3', '0456', '126.490864,48.241365', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('775', '769', '231182', '五大连池市', '3', '0456', '126.205516,48.517257', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('776', '649', '231200', '绥化市', '2', '0455', '126.968887,46.653845', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('777', '776', '231202', '北林区', '3', '0455', '126.985504,46.6375', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('778', '776', '231221', '望奎县', '3', '0455', '126.486075,46.832719', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('779', '776', '231222', '兰西县', '3', '0455', '126.288117,46.25245', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('780', '776', '231223', '青冈县', '3', '0455', '126.099195,46.70391', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('781', '776', '231224', '庆安县', '3', '0455', '127.507824,46.880102', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('782', '776', '231225', '明水县', '3', '0455', '125.906301,47.173426', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('783', '776', '231226', '绥棱县', '3', '0455', '127.114832,47.236015', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('784', '776', '231281', '安达市', '3', '0455', '125.346156,46.419633', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('785', '776', '231282', '肇东市', '3', '0455', '125.961814,46.051126', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('786', '776', '231283', '海伦市', '3', '0455', '126.930106,47.45117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('787', '649', '232700', '大兴安岭地区', '2', '0457', '124.711526,52.335262', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('788', '787', '232701', '加格达奇区', '3', '0457', '124.139595,50.408735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('789', '787', '232721', '呼玛县', '3', '0457', '126.652396,51.726091', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('790', '787', '232722', '塔河县', '3', '0457', '124.709996,52.334456', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('791', '787', '232723', '漠河县', '3', '0457', '122.538591,52.972272', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('792', '-1', '310000', '上海市', '1', '021', '121.473662,31.230372', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('793', '792', '310100', '上海城区', '2', '021', '121.473662,31.230372', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('794', '793', '310101', '黄浦区', '3', '021', '121.484428,31.231739', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('795', '793', '310104', '徐汇区', '3', '021', '121.436128,31.188464', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('796', '793', '310105', '长宁区', '3', '021', '121.424622,31.220372', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('797', '793', '310106', '静安区', '3', '021', '121.447453,31.227906', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('798', '793', '310107', '普陀区', '3', '021', '121.395514,31.249603', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('799', '793', '310109', '虹口区', '3', '021', '121.505133,31.2646', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('800', '793', '310110', '杨浦区', '3', '021', '121.525727,31.259822', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('801', '793', '310112', '闵行区', '3', '021', '121.380831,31.1129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('802', '793', '310113', '宝山区', '3', '021', '121.489612,31.405457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('803', '793', '310114', '嘉定区', '3', '021', '121.265374,31.375869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('804', '793', '310115', '浦东新区', '3', '021', '121.544379,31.221517', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('805', '793', '310116', '金山区', '3', '021', '121.342455,30.741798', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('806', '793', '310117', '松江区', '3', '021', '121.227747,31.032243', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('807', '793', '310118', '青浦区', '3', '021', '121.124178,31.150681', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('808', '793', '310120', '奉贤区', '3', '021', '121.474055,30.917766', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('809', '793', '310151', '崇明区', '3', '021', '121.397421,31.623728', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('810', '-1', '320000', '江苏省', '1', '[]', '118.762765,32.060875', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('811', '810', '320100', '南京市', '2', '025', '118.796682,32.05957', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('812', '811', '320102', '玄武区', '3', '025', '118.797757,32.048498', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('813', '811', '320104', '秦淮区', '3', '025', '118.79476,32.039113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('814', '811', '320105', '建邺区', '3', '025', '118.731793,32.003731', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('815', '811', '320106', '鼓楼区', '3', '025', '118.770182,32.066601', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('816', '811', '320111', '浦口区', '3', '025', '118.628003,32.058903', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('817', '811', '320113', '栖霞区', '3', '025', '118.909153,32.096388', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('818', '811', '320114', '雨花台区', '3', '025', '118.779051,31.99126', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('819', '811', '320115', '江宁区', '3', '025', '118.840015,31.952612', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('820', '811', '320116', '六合区', '3', '025', '118.822132,32.323584', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('821', '811', '320117', '溧水区', '3', '025', '119.028288,31.651099', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('822', '811', '320118', '高淳区', '3', '025', '118.89222,31.327586', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('823', '810', '320200', '无锡市', '2', '0510', '120.31191,31.491169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('824', '823', '320205', '锡山区', '3', '0510', '120.357858,31.589715', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('825', '823', '320206', '惠山区', '3', '0510', '120.298433,31.680335', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('826', '823', '320211', '滨湖区', '3', '0510', '120.283811,31.527276', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('827', '823', '320213', '梁溪区', '3', '0510', '120.303108,31.566155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('828', '823', '320214', '新吴区', '3', '0510', '120.352782,31.550966', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('829', '823', '320281', '江阴市', '3', '0510', '120.286129,31.921345', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('830', '823', '320282', '宜兴市', '3', '0510', '119.823308,31.340637', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('831', '810', '320300', '徐州市', '2', '0516', '117.284124,34.205768', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('832', '831', '320302', '鼓楼区', '3', '0516', '117.185576,34.288646', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('833', '831', '320303', '云龙区', '3', '0516', '117.251076,34.253164', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('834', '831', '320305', '贾汪区', '3', '0516', '117.464958,34.436936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('835', '831', '320311', '泉山区', '3', '0516', '117.194469,34.225522', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('836', '831', '320312', '铜山区', '3', '0516', '117.169461,34.180779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('837', '831', '320321', '丰县', '3', '0516', '116.59539,34.693906', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('838', '831', '320322', '沛县', '3', '0516', '116.936353,34.760761', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('839', '831', '320324', '睢宁县', '3', '0516', '117.941563,33.912597', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('840', '831', '320381', '新沂市', '3', '0516', '118.354537,34.36958', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('841', '831', '320382', '邳州市', '3', '0516', '118.012531,34.338888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('842', '810', '320400', '常州市', '2', '0519', '119.974061,31.811226', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('843', '842', '320402', '天宁区', '3', '0519', '119.999219,31.792787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('844', '842', '320404', '钟楼区', '3', '0519', '119.902369,31.802089', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('845', '842', '320411', '新北区', '3', '0519', '119.971697,31.830427', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('846', '842', '320412', '武进区', '3', '0519', '119.942437,31.701187', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('847', '842', '320413', '金坛区', '3', '0519', '119.597811,31.723219', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('848', '842', '320481', '溧阳市', '3', '0519', '119.48421,31.416911', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('849', '810', '320500', '苏州市', '2', '0512', '120.585728,31.2974', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('850', '849', '320505', '虎丘区', '3', '0512', '120.434238,31.329601', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('851', '849', '320506', '吴中区', '3', '0512', '120.632308,31.263183', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('852', '849', '320507', '相城区', '3', '0512', '120.642626,31.369089', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('853', '849', '320508', '姑苏区', '3', '0512', '120.617369,31.33565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('854', '849', '320509', '吴江区', '3', '0512', '120.645157,31.138677', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('855', '849', '320581', '常熟市', '3', '0512', '120.752481,31.654375', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('856', '849', '320582', '张家港市', '3', '0512', '120.555982,31.875571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('857', '849', '320583', '昆山市', '3', '0512', '120.980736,31.385597', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('858', '849', '320585', '太仓市', '3', '0512', '121.13055,31.457735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('859', '810', '320600', '南通市', '2', '0513', '120.894676,31.981143', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('860', '859', '320602', '崇川区', '3', '0513', '120.857434,32.009875', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('861', '859', '320611', '港闸区', '3', '0513', '120.818526,32.032441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('862', '859', '320612', '通州区', '3', '0513', '121.073828,32.06568', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('863', '859', '320621', '海安县', '3', '0513', '120.467343,32.533572', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('864', '859', '320623', '如东县', '3', '0513', '121.185201,32.331765', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('865', '859', '320681', '启东市', '3', '0513', '121.655432,31.793278', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('866', '859', '320682', '如皋市', '3', '0513', '120.573803,32.371562', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('867', '859', '320684', '海门市', '3', '0513', '121.18181,31.869483', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('868', '810', '320700', '连云港市', '2', '0518', '119.221611,34.596653', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('869', '868', '320703', '连云区', '3', '0518', '119.338788,34.760249', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('870', '868', '320706', '海州区', '3', '0518', '119.163509,34.572274', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('871', '868', '320707', '赣榆区', '3', '0518', '119.17333,34.841348', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('872', '868', '320722', '东海县', '3', '0518', '118.752842,34.542308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('873', '868', '320723', '灌云县', '3', '0518', '119.239381,34.284381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('874', '868', '320724', '灌南县', '3', '0518', '119.315651,34.087134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('875', '810', '320800', '淮安市', '2', '0517', '119.113185,33.551052', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('876', '875', '320812', '清江浦区', '3', '0517', '119.026718,33.552627', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('877', '875', '320803', '淮安区', '3', '0517', '119.141099,33.502868', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('878', '875', '320804', '淮阴区', '3', '0517', '119.034725,33.631892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('879', '875', '320813', '洪泽区', '3', '0517', '118.873241,33.294214', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('880', '875', '320826', '涟水县', '3', '0517', '119.260227,33.781331', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('881', '875', '320830', '盱眙县', '3', '0517', '118.54436,33.011971', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('882', '875', '320831', '金湖县', '3', '0517', '119.020584,33.025433', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('883', '810', '320900', '盐城市', '2', '0515', '120.163107,33.347708', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('884', '883', '320902', '亭湖区', '3', '0515', '120.197358,33.390536', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('885', '883', '320903', '盐都区', '3', '0515', '120.153712,33.338283', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('886', '883', '320904', '大丰区', '3', '0515', '120.50085,33.200333', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('887', '883', '320921', '响水县', '3', '0515', '119.578364,34.199479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('888', '883', '320922', '滨海县', '3', '0515', '119.82083,33.990334', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('889', '883', '320923', '阜宁县', '3', '0515', '119.802527,33.759325', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('890', '883', '320924', '射阳县', '3', '0515', '120.229986,33.758361', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('891', '883', '320925', '建湖县', '3', '0515', '119.7886,33.439067', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('892', '883', '320981', '东台市', '3', '0515', '120.320328,32.868426', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('893', '810', '321000', '扬州市', '2', '0514', '119.412939,32.394209', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('894', '893', '321002', '广陵区', '3', '0514', '119.431849,32.39472', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('895', '893', '321003', '邗江区', '3', '0514', '119.397994,32.377655', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('896', '893', '321012', '江都区', '3', '0514', '119.569989,32.434672', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('897', '893', '321023', '宝应县', '3', '0514', '119.360729,33.240391', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('898', '893', '321081', '仪征市', '3', '0514', '119.184766,32.272258', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('899', '893', '321084', '高邮市', '3', '0514', '119.459161,32.781659', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('900', '810', '321100', '镇江市', '2', '0511', '119.425836,32.187849', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('901', '900', '321102', '京口区', '3', '0511', '119.47016,32.19828', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('902', '900', '321111', '润州区', '3', '0511', '119.411959,32.195264', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('903', '900', '321112', '丹徒区', '3', '0511', '119.433853,32.131962', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('904', '900', '321181', '丹阳市', '3', '0511', '119.606439,32.010214', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('905', '900', '321182', '扬中市', '3', '0511', '119.797634,32.23483', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('906', '900', '321183', '句容市', '3', '0511', '119.168695,31.944998', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('907', '810', '321200', '泰州市', '2', '0523', '119.922933,32.455536', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('908', '907', '321202', '海陵区', '3', '0523', '119.919424,32.491016', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('909', '907', '321203', '高港区', '3', '0523', '119.881717,32.318821', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('910', '907', '321204', '姜堰区', '3', '0523', '120.127934,32.509155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('911', '907', '321281', '兴化市', '3', '0523', '119.852541,32.910459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('912', '907', '321282', '靖江市', '3', '0523', '120.277138,31.982751', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('913', '907', '321283', '泰兴市', '3', '0523', '120.051743,32.171853', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('914', '810', '321300', '宿迁市', '2', '0527', '118.275198,33.963232', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('915', '914', '321302', '宿城区', '3', '0527', '118.242533,33.963029', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('916', '914', '321311', '宿豫区', '3', '0527', '118.330781,33.946822', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('917', '914', '321322', '沭阳县', '3', '0527', '118.804784,34.111022', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('918', '914', '321323', '泗阳县', '3', '0527', '118.703424,33.722478', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('919', '914', '321324', '泗洪县', '3', '0527', '118.223591,33.476051', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('920', '-1', '330000', '浙江省', '1', '[]', '120.152585,30.266597', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('921', '920', '330100', '杭州市', '2', '0571', '120.209789,30.24692', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('922', '921', '330102', '上城区', '3', '0571', '120.169312,30.242404', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('923', '921', '330103', '下城区', '3', '0571', '120.180891,30.281677', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('924', '921', '330104', '江干区', '3', '0571', '120.205001,30.257012', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('925', '921', '330105', '拱墅区', '3', '0571', '120.141406,30.319037', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('926', '921', '330106', '西湖区', '3', '0571', '120.130194,30.259463', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('927', '921', '330108', '滨江区', '3', '0571', '120.211623,30.208847', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('928', '921', '330109', '萧山区', '3', '0571', '120.264253,30.183806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('929', '921', '330110', '余杭区', '3', '0571', '120.299401,30.419045', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('930', '921', '330111', '富阳区', '3', '0571', '119.960076,30.048692', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('931', '921', '330122', '桐庐县', '3', '0571', '119.691467,29.79299', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('932', '921', '330127', '淳安县', '3', '0571', '119.042037,29.608886', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('933', '921', '330182', '建德市', '3', '0571', '119.281231,29.474759', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('934', '921', '330185', '临安市', '3', '0571', '119.724734,30.233873', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('935', '920', '330200', '宁波市', '2', '0574', '121.622485,29.859971', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('936', '935', '330203', '海曙区', '3', '0574', '121.550752,29.874903', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('937', '935', '330205', '江北区', '3', '0574', '121.555081,29.886781', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('938', '935', '330206', '北仑区', '3', '0574', '121.844172,29.899778', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('939', '935', '330211', '镇海区', '3', '0574', '121.596496,29.965203', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('940', '935', '330212', '鄞州区', '3', '0574', '121.546603,29.816511', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('941', '935', '330225', '象山县', '3', '0574', '121.869339,29.476705', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('942', '935', '330226', '宁海县', '3', '0574', '121.429477,29.287939', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('943', '935', '330281', '余姚市', '3', '0574', '121.154629,30.037106', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('944', '935', '330282', '慈溪市', '3', '0574', '121.266561,30.170261', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('945', '935', '330213', '奉化区', '3', '0574', '121.406997,29.655144', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('946', '920', '330300', '温州市', '2', '0577', '120.699361,27.993828', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('947', '946', '330302', '鹿城区', '3', '0577', '120.655271,28.015737', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('948', '946', '330303', '龙湾区', '3', '0577', '120.811213,27.932747', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('949', '946', '330304', '瓯海区', '3', '0577', '120.61491,27.966844', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('950', '946', '330305', '洞头区', '3', '0577', '121.157249,27.836154', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('951', '946', '330324', '永嘉县', '3', '0577', '120.692025,28.153607', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('952', '946', '330326', '平阳县', '3', '0577', '120.565793,27.661918', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('953', '946', '330327', '苍南县', '3', '0577', '120.427619,27.519773', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('954', '946', '330328', '文成县', '3', '0577', '120.091498,27.786996', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('955', '946', '330329', '泰顺县', '3', '0577', '119.717649,27.556884', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('956', '946', '330381', '瑞安市', '3', '0577', '120.655148,27.778657', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('957', '946', '330382', '乐清市', '3', '0577', '120.983906,28.113725', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('958', '920', '330400', '嘉兴市', '2', '0573', '120.75547,30.746191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('959', '958', '330402', '南湖区', '3', '0573', '120.783024,30.747842', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('960', '958', '330411', '秀洲区', '3', '0573', '120.710082,30.765188', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('961', '958', '330421', '嘉善县', '3', '0573', '120.926028,30.830864', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('962', '958', '330424', '海盐县', '3', '0573', '120.946263,30.526435', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('963', '958', '330481', '海宁市', '3', '0573', '120.680239,30.511539', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('964', '958', '330482', '平湖市', '3', '0573', '121.015142,30.677233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('965', '958', '330483', '桐乡市', '3', '0573', '120.565098,30.630173', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('966', '920', '330500', '湖州市', '2', '0572', '120.086809,30.89441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('967', '966', '330502', '吴兴区', '3', '0572', '120.185838,30.857151', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('968', '966', '330503', '南浔区', '3', '0572', '120.418513,30.849689', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('969', '966', '330521', '德清县', '3', '0572', '119.9774,30.54251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('970', '966', '330522', '长兴县', '3', '0572', '119.910952,31.026665', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('971', '966', '330523', '安吉县', '3', '0572', '119.680353,30.638674', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('972', '920', '330600', '绍兴市', '2', '0575', '120.580364,30.030192', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('973', '972', '330602', '越城区', '3', '0575', '120.582633,29.988244', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('974', '972', '330603', '柯桥区', '3', '0575', '120.495085,30.081929', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('975', '972', '330604', '上虞区', '3', '0575', '120.868122,30.03312', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('976', '972', '330624', '新昌县', '3', '0575', '120.903866,29.499831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('977', '972', '330681', '诸暨市', '3', '0575', '120.246863,29.708692', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('978', '972', '330683', '嵊州市', '3', '0575', '120.831025,29.56141', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('979', '920', '330700', '金华市', '2', '0579', '119.647229,29.079208', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('980', '979', '330702', '婺城区', '3', '0579', '119.571728,29.0872', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('981', '979', '330703', '金东区', '3', '0579', '119.69278,29.099723', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('982', '979', '330723', '武义县', '3', '0579', '119.816562,28.89267', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('983', '979', '330726', '浦江县', '3', '0579', '119.892222,29.452476', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('984', '979', '330727', '磐安县', '3', '0579', '120.450005,29.054548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('985', '979', '330781', '兰溪市', '3', '0579', '119.460472,29.2084', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('986', '979', '330782', '义乌市', '3', '0579', '120.075106,29.306775', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('987', '979', '330783', '东阳市', '3', '0579', '120.241566,29.289648', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('988', '979', '330784', '永康市', '3', '0579', '120.047651,28.888555', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('989', '920', '330800', '衢州市', '2', '0570', '118.859457,28.970079', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('990', '989', '330802', '柯城区', '3', '0570', '118.871516,28.96862', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('991', '989', '330803', '衢江区', '3', '0570', '118.95946,28.97978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('992', '989', '330822', '常山县', '3', '0570', '118.511235,28.901462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('993', '989', '330824', '开化县', '3', '0570', '118.415495,29.137336', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('994', '989', '330825', '龙游县', '3', '0570', '119.172189,29.028439', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('995', '989', '330881', '江山市', '3', '0570', '118.626991,28.737331', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('996', '920', '330900', '舟山市', '2', '0580', '122.207106,29.985553', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('997', '996', '330902', '定海区', '3', '0580', '122.106773,30.019858', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('998', '996', '330903', '普陀区', '3', '0580', '122.323867,29.97176', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('999', '996', '330921', '岱山县', '3', '0580', '122.226237,30.264139', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1000', '996', '330922', '嵊泗县', '3', '0580', '122.451382,30.725686', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1001', '920', '331000', '台州市', '2', '0576', '121.42076,28.65638', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1002', '1001', '331002', '椒江区', '3', '0576', '121.442978,28.672981', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1003', '1001', '331003', '黄岩区', '3', '0576', '121.261972,28.650083', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1004', '1001', '331004', '路桥区', '3', '0576', '121.365123,28.582654', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1005', '1001', '331021', '玉环市', '3', '0576', '121.231805,28.135929', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1006', '1001', '331022', '三门县', '3', '0576', '121.395711,29.104789', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1007', '1001', '331023', '天台县', '3', '0576', '121.006595,29.144064', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1008', '1001', '331024', '仙居县', '3', '0576', '120.728801,28.846966', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1009', '1001', '331081', '温岭市', '3', '0576', '121.385604,28.372506', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1010', '1001', '331082', '临海市', '3', '0576', '121.144556,28.858881', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1011', '920', '331100', '丽水市', '2', '0578', '119.922796,28.46763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1012', '1011', '331102', '莲都区', '3', '0578', '119.912626,28.445928', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1013', '1011', '331121', '青田县', '3', '0578', '120.289478,28.139837', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1014', '1011', '331122', '缙云县', '3', '0578', '120.091572,28.659283', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1015', '1011', '331123', '遂昌县', '3', '0578', '119.276103,28.592148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1016', '1011', '331124', '松阳县', '3', '0578', '119.481511,28.448803', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1017', '1011', '331125', '云和县', '3', '0578', '119.573397,28.11579', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1018', '1011', '331126', '庆元县', '3', '0578', '119.06259,27.61922', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1019', '1011', '331127', '景宁畲族自治县', '3', '0578', '119.635739,27.9733', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1020', '1011', '331181', '龙泉市', '3', '0578', '119.141473,28.074649', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1021', '-1', '340000', '安徽省', '1', '[]', '117.329949,31.733806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1022', '1021', '340100', '合肥市', '2', '0551', '117.227219,31.820591', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1023', '1022', '340102', '瑶海区', '3', '0551', '117.309546,31.857917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1024', '1022', '340103', '庐阳区', '3', '0551', '117.264786,31.878589', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1025', '1022', '340104', '蜀山区', '3', '0551', '117.260521,31.85124', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1026', '1022', '340111', '包河区', '3', '0551', '117.309519,31.793859', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1027', '1022', '340121', '长丰县', '3', '0551', '117.167564,32.478018', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1028', '1022', '340122', '肥东县', '3', '0551', '117.469382,31.88794', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1029', '1022', '340123', '肥西县', '3', '0551', '117.157981,31.706809', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1030', '1022', '340124', '庐江县', '3', '0551', '117.2882,31.256524', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1031', '1022', '340181', '巢湖市', '3', '0551', '117.890354,31.624522', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1032', '1021', '340200', '芜湖市', '2', '0553', '118.432941,31.352859', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1033', '1032', '340202', '镜湖区', '3', '0553', '118.385009,31.340728', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1034', '1032', '340203', '弋江区', '3', '0553', '118.372655,31.311756', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1035', '1032', '340207', '鸠江区', '3', '0553', '118.391734,31.369373', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1036', '1032', '340208', '三山区', '3', '0553', '118.268101,31.219568', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1037', '1032', '340221', '芜湖县', '3', '0553', '118.576124,31.134809', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1038', '1032', '340222', '繁昌县', '3', '0553', '118.198703,31.101782', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1039', '1032', '340223', '南陵县', '3', '0553', '118.334359,30.914922', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1040', '1032', '340225', '无为县', '3', '0553', '117.902366,31.303167', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1041', '1021', '340300', '蚌埠市', '2', '0552', '117.388512,32.91663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1042', '1041', '340302', '龙子湖区', '3', '0552', '117.379778,32.950611', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1043', '1041', '340303', '蚌山区', '3', '0552', '117.373595,32.917048', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1044', '1041', '340304', '禹会区', '3', '0552', '117.342155,32.929799', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1045', '1041', '340311', '淮上区', '3', '0552', '117.35933,32.965435', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1046', '1041', '340321', '怀远县', '3', '0552', '117.205237,32.970031', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1047', '1041', '340322', '五河县', '3', '0552', '117.879486,33.127823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1048', '1041', '340323', '固镇县', '3', '0552', '117.316913,33.31688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1049', '1021', '340400', '淮南市', '2', '0554', '117.018399,32.587117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1050', '1049', '340402', '大通区', '3', '0554', '117.053314,32.631519', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1051', '1049', '340403', '田家庵区', '3', '0554', '117.017349,32.647277', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1052', '1049', '340404', '谢家集区', '3', '0554', '116.859188,32.600037', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1053', '1049', '340405', '八公山区', '3', '0554', '116.83349,32.631379', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1054', '1049', '340406', '潘集区', '3', '0554', '116.834715,32.77208', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1055', '1049', '340421', '凤台县', '3', '0554', '116.71105,32.709444', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1056', '1049', '340422', '寿县', '3', '0554', '116.798232,32.545109', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1057', '1021', '340500', '马鞍山市', '2', '0555', '118.507011,31.67044', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1058', '1057', '340503', '花山区', '3', '0555', '118.492565,31.71971', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1059', '1057', '340504', '雨山区', '3', '0555', '118.498578,31.682132', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1060', '1057', '340506', '博望区', '3', '0555', '118.844538,31.558471', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1061', '1057', '340521', '当涂县', '3', '0555', '118.497972,31.571213', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1062', '1057', '340522', '含山县', '3', '0555', '118.101421,31.735598', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1063', '1057', '340523', '和县', '3', '0555', '118.353667,31.742293', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1064', '1021', '340600', '淮北市', '2', '0561', '116.798265,33.955844', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1065', '1064', '340602', '杜集区', '3', '0561', '116.828133,33.991451', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1066', '1064', '340603', '相山区', '3', '0561', '116.794344,33.959892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1067', '1064', '340604', '烈山区', '3', '0561', '116.813042,33.895139', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1068', '1064', '340621', '濉溪县', '3', '0561', '116.766298,33.915477', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1069', '1021', '340700', '铜陵市', '2', '0562', '117.81154,30.945515', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1070', '1069', '340705', '铜官区', '3', '0562', '117.85616,30.936272', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1071', '1069', '340706', '义安区', '3', '0562', '117.791544,30.952823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1072', '1069', '340711', '郊区', '3', '0562', '117.768026,30.821069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1073', '1069', '340722', '枞阳县', '3', '0562', '117.250594,30.706018', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1074', '1021', '340800', '安庆市', '2', '0556', '117.115101,30.531919', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1075', '1074', '340802', '迎江区', '3', '0556', '117.09115,30.511548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1076', '1074', '340803', '大观区', '3', '0556', '117.013469,30.553697', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1077', '1074', '340811', '宜秀区', '3', '0556', '116.987542,30.613332', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1078', '1074', '340822', '怀宁县', '3', '0556', '116.829475,30.733824', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1079', '1074', '340824', '潜山县', '3', '0556', '116.581371,30.631136', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1080', '1074', '340825', '太湖县', '3', '0556', '116.308795,30.45422', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1081', '1074', '340826', '宿松县', '3', '0556', '116.129105,30.153746', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1082', '1074', '340827', '望江县', '3', '0556', '116.706498,30.128002', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1083', '1074', '340828', '岳西县', '3', '0556', '116.359692,30.849762', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1084', '1074', '340881', '桐城市', '3', '0556', '116.936748,31.035848', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1085', '1021', '341000', '黄山市', '2', '0559', '118.338272,29.715185', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1086', '1085', '341002', '屯溪区', '3', '0559', '118.315329,29.696108', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1087', '1085', '341003', '黄山区', '3', '0559', '118.141567,30.272942', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1088', '1085', '341004', '徽州区', '3', '0559', '118.336743,29.827271', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1089', '1085', '341021', '歙县', '3', '0559', '118.415345,29.861379', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1090', '1085', '341022', '休宁县', '3', '0559', '118.193618,29.784124', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1091', '1085', '341023', '黟县', '3', '0559', '117.938373,29.924805', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1092', '1085', '341024', '祁门县', '3', '0559', '117.717396,29.854055', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1093', '1021', '341100', '滁州市', '2', '0550', '118.327944,32.255636', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1094', '1093', '341102', '琅琊区', '3', '0550', '118.305961,32.294631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1095', '1093', '341103', '南谯区', '3', '0550', '118.41697,32.200197', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1096', '1093', '341122', '来安县', '3', '0550', '118.435718,32.452199', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1097', '1093', '341124', '全椒县', '3', '0550', '118.274149,32.08593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1098', '1093', '341125', '定远县', '3', '0550', '117.698562,32.530981', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1099', '1093', '341126', '凤阳县', '3', '0550', '117.531622,32.874735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1100', '1093', '341181', '天长市', '3', '0550', '119.004816,32.667571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1101', '1093', '341182', '明光市', '3', '0550', '118.018193,32.78196', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1102', '1021', '341200', '阜阳市', '2', '1558', '115.814504,32.890479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1103', '1102', '341202', '颍州区', '3', '1558', '115.806942,32.883468', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1104', '1102', '341203', '颍东区', '3', '1558', '115.856762,32.912477', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1105', '1102', '341204', '颍泉区', '3', '1558', '115.80835,32.925211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1106', '1102', '341221', '临泉县', '3', '1558', '115.263115,33.039715', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1107', '1102', '341222', '太和县', '3', '1558', '115.621941,33.160327', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1108', '1102', '341225', '阜南县', '3', '1558', '115.595643,32.658297', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1109', '1102', '341226', '颍上县', '3', '1558', '116.256772,32.653211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1110', '1102', '341282', '界首市', '3', '1558', '115.374821,33.258244', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1111', '1021', '341300', '宿州市', '2', '0557', '116.964195,33.647309', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1112', '1111', '341302', '埇桥区', '3', '0557', '116.977203,33.64059', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1113', '1111', '341321', '砀山县', '3', '0557', '116.367095,34.442561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1114', '1111', '341322', '萧县', '3', '0557', '116.947349,34.188732', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1115', '1111', '341323', '灵璧县', '3', '0557', '117.549395,33.554604', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1116', '1111', '341324', '泗县', '3', '0557', '117.910629,33.482982', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1117', '1021', '341500', '六安市', '2', '0564', '116.520139,31.735456', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1118', '1117', '341502', '金安区', '3', '0564', '116.539173,31.750119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1119', '1117', '341503', '裕安区', '3', '0564', '116.479829,31.738183', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1120', '1117', '341504', '叶集区', '3', '0564', '115.925271,31.863693', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1121', '1117', '341522', '霍邱县', '3', '0564', '116.277911,32.353038', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1122', '1117', '341523', '舒城县', '3', '0564', '116.948736,31.462234', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1123', '1117', '341524', '金寨县', '3', '0564', '115.934366,31.72717', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1124', '1117', '341525', '霍山县', '3', '0564', '116.351892,31.410561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1125', '1021', '341600', '亳州市', '2', '0558', '115.77867,33.844592', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1126', '1125', '341602', '谯城区', '3', '0558', '115.779025,33.876235', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1127', '1125', '341621', '涡阳县', '3', '0558', '116.215665,33.492921', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1128', '1125', '341622', '蒙城县', '3', '0558', '116.564247,33.26583', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1129', '1125', '341623', '利辛县', '3', '0558', '116.208564,33.144515', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1130', '1021', '341700', '池州市', '2', '0566', '117.491592,30.664779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1131', '1130', '341702', '贵池区', '3', '0566', '117.567264,30.687219', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1132', '1130', '341721', '东至县', '3', '0566', '117.027618,30.111163', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1133', '1130', '341722', '石台县', '3', '0566', '117.486306,30.210313', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1134', '1130', '341723', '青阳县', '3', '0566', '117.84743,30.63923', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1135', '1021', '341800', '宣城市', '2', '0563', '118.75868,30.940195', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1136', '1135', '341802', '宣州区', '3', '0563', '118.785561,30.944076', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1137', '1135', '341821', '郎溪县', '3', '0563', '119.179656,31.126412', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1138', '1135', '341822', '广德县', '3', '0563', '119.420935,30.877555', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1139', '1135', '341823', '泾县', '3', '0563', '118.419859,30.688634', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1140', '1135', '341824', '绩溪县', '3', '0563', '118.578519,30.067533', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1141', '1135', '341825', '旌德县', '3', '0563', '118.549861,30.298142', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1142', '1135', '341881', '宁国市', '3', '0563', '118.983171,30.633882', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1143', '-1', '350000', '福建省', '1', '[]', '119.295143,26.100779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1144', '1143', '350100', '福州市', '2', '0591', '119.296389,26.074268', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1145', '1144', '350102', '鼓楼区', '3', '0591', '119.303917,26.081983', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1146', '1144', '350103', '台江区', '3', '0591', '119.314041,26.052843', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1147', '1144', '350104', '仓山区', '3', '0591', '119.273545,26.046743', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1148', '1144', '350105', '马尾区', '3', '0591', '119.455588,25.9895', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1149', '1144', '350111', '晋安区', '3', '0591', '119.328521,26.082107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1150', '1144', '350121', '闽侯县', '3', '0591', '119.131724,26.150047', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1151', '1144', '350122', '连江县', '3', '0591', '119.539704,26.197364', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1152', '1144', '350123', '罗源县', '3', '0591', '119.549776,26.489558', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1153', '1144', '350124', '闽清县', '3', '0591', '118.863361,26.221197', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1154', '1144', '350125', '永泰县', '3', '0591', '118.932592,25.866694', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1155', '1144', '350128', '平潭县', '3', '0591', '119.790168,25.49872', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1156', '1144', '350181', '福清市', '3', '0591', '119.384201,25.72071', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1157', '1144', '350182', '长乐市', '3', '0591', '119.523266,25.962888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1158', '1143', '350200', '厦门市', '2', '0592', '118.089204,24.479664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1159', '1158', '350203', '思明区', '3', '0592', '118.082649,24.445484', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1160', '1158', '350205', '海沧区', '3', '0592', '118.032984,24.484685', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1161', '1158', '350206', '湖里区', '3', '0592', '118.146768,24.512904', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1162', '1158', '350211', '集美区', '3', '0592', '118.097337,24.575969', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1163', '1158', '350212', '同安区', '3', '0592', '118.152041,24.723234', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1164', '1158', '350213', '翔安区', '3', '0592', '118.248034,24.618543', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1165', '1143', '350300', '莆田市', '2', '0594', '119.007777,25.454084', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1166', '1165', '350302', '城厢区', '3', '0594', '118.993884,25.419319', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1167', '1165', '350303', '涵江区', '3', '0594', '119.116289,25.45872', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1168', '1165', '350304', '荔城区', '3', '0594', '119.015061,25.431941', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1169', '1165', '350305', '秀屿区', '3', '0594', '119.105494,25.31836', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1170', '1165', '350322', '仙游县', '3', '0594', '118.691637,25.362093', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1171', '1143', '350400', '三明市', '2', '0598', '117.638678,26.263406', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1172', '1171', '350402', '梅列区', '3', '0598', '117.645855,26.271711', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1173', '1171', '350403', '三元区', '3', '0598', '117.608044,26.234019', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1174', '1171', '350421', '明溪县', '3', '0598', '117.202226,26.355856', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1175', '1171', '350423', '清流县', '3', '0598', '116.816909,26.177796', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1176', '1171', '350424', '宁化县', '3', '0598', '116.654365,26.261754', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1177', '1171', '350425', '大田县', '3', '0598', '117.847115,25.692699', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1178', '1171', '350426', '尤溪县', '3', '0598', '118.190467,26.170171', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1179', '1171', '350427', '沙县', '3', '0598', '117.792396,26.397199', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1180', '1171', '350428', '将乐县', '3', '0598', '117.471372,26.728952', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1181', '1171', '350429', '泰宁县', '3', '0598', '117.17574,26.900259', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1182', '1171', '350430', '建宁县', '3', '0598', '116.848443,26.833588', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1183', '1171', '350481', '永安市', '3', '0598', '117.365052,25.941937', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1184', '1143', '350500', '泉州市', '2', '0595', '118.675676,24.874132', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1185', '1184', '350502', '鲤城区', '3', '0595', '118.587097,24.907424', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1186', '1184', '350503', '丰泽区', '3', '0595', '118.613172,24.891173', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1187', '1184', '350504', '洛江区', '3', '0595', '118.671193,24.939796', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1188', '1184', '350505', '泉港区', '3', '0595', '118.916309,25.119815', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1189', '1184', '350521', '惠安县', '3', '0595', '118.796607,25.030801', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1190', '1184', '350524', '安溪县', '3', '0595', '118.186288,25.055954', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1191', '1184', '350525', '永春县', '3', '0595', '118.294048,25.321565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1192', '1184', '350526', '德化县', '3', '0595', '118.241094,25.491493', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1193', '1184', '350527', '金门县', '3', '0595', '118.323221,24.436417', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1194', '1184', '350581', '石狮市', '3', '0595', '118.648066,24.732204', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1195', '1184', '350582', '晋江市', '3', '0595', '118.551682,24.781636', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1196', '1184', '350583', '南安市', '3', '0595', '118.386279,24.960385', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1197', '1143', '350600', '漳州市', '2', '0596', '117.647093,24.513025', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1198', '1197', '350602', '芗城区', '3', '0596', '117.653968,24.510787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1199', '1197', '350603', '龙文区', '3', '0596', '117.709754,24.503113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1200', '1197', '350622', '云霄县', '3', '0596', '117.339573,23.957936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1201', '1197', '350623', '漳浦县', '3', '0596', '117.613808,24.117102', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1202', '1197', '350624', '诏安县', '3', '0596', '117.175184,23.711579', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1203', '1197', '350625', '长泰县', '3', '0596', '117.759153,24.625449', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1204', '1197', '350626', '东山县', '3', '0596', '117.430061,23.701262', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1205', '1197', '350627', '南靖县', '3', '0596', '117.35732,24.514654', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1206', '1197', '350628', '平和县', '3', '0596', '117.315017,24.363508', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1207', '1197', '350629', '华安县', '3', '0596', '117.534103,25.004425', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1208', '1197', '350681', '龙海市', '3', '0596', '117.818197,24.446706', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1209', '1143', '350700', '南平市', '2', '0599', '118.17771,26.641774', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1210', '1209', '350702', '延平区', '3', '0599', '118.182036,26.637438', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1211', '1209', '350703', '建阳区', '3', '0599', '118.120464,27.331876', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1212', '1209', '350721', '顺昌县', '3', '0599', '117.810357,26.793288', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1213', '1209', '350722', '浦城县', '3', '0599', '118.541256,27.917263', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1214', '1209', '350723', '光泽县', '3', '0599', '117.334106,27.540987', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1215', '1209', '350724', '松溪县', '3', '0599', '118.785468,27.526232', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1216', '1209', '350725', '政和县', '3', '0599', '118.857642,27.366104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1217', '1209', '350781', '邵武市', '3', '0599', '117.492533,27.340326', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1218', '1209', '350782', '武夷山市', '3', '0599', '118.035309,27.756647', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1219', '1209', '350783', '建瓯市', '3', '0599', '118.304966,27.022774', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1220', '1143', '350800', '龙岩市', '2', '0597', '117.017295,25.075119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1221', '1220', '350802', '新罗区', '3', '0597', '117.037155,25.098312', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1222', '1220', '350803', '永定区', '3', '0597', '116.732091,24.723961', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1223', '1220', '350821', '长汀县', '3', '0597', '116.357581,25.833531', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1224', '1220', '350823', '上杭县', '3', '0597', '116.420098,25.049518', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1225', '1220', '350824', '武平县', '3', '0597', '116.100414,25.095386', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1226', '1220', '350825', '连城县', '3', '0597', '116.754472,25.710538', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1227', '1220', '350881', '漳平市', '3', '0597', '117.419998,25.290184', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1228', '1143', '350900', '宁德市', '2', '0593', '119.547932,26.665617', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1229', '1228', '350902', '蕉城区', '3', '0593', '119.526299,26.66061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1230', '1228', '350921', '霞浦县', '3', '0593', '120.005146,26.885703', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1231', '1228', '350922', '古田县', '3', '0593', '118.746284,26.577837', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1232', '1228', '350923', '屏南县', '3', '0593', '118.985895,26.908276', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1233', '1228', '350924', '寿宁县', '3', '0593', '119.514986,27.454479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1234', '1228', '350925', '周宁县', '3', '0593', '119.339025,27.104591', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1235', '1228', '350926', '柘荣县', '3', '0593', '119.900609,27.233933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1236', '1228', '350981', '福安市', '3', '0593', '119.64785,27.08834', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1237', '1228', '350982', '福鼎市', '3', '0593', '120.216977,27.324479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1238', '-1', '360000', '江西省', '1', '[]', '115.81635,28.63666', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1239', '1238', '360100', '南昌市', '2', '0791', '115.858198,28.682892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1240', '1239', '360102', '东湖区', '3', '0791', '115.903526,28.698731', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1241', '1239', '360103', '西湖区', '3', '0791', '115.877233,28.657595', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1242', '1239', '360104', '青云谱区', '3', '0791', '115.925749,28.621169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1243', '1239', '360105', '湾里区', '3', '0791', '115.730847,28.714796', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1244', '1239', '360111', '青山湖区', '3', '0791', '115.962144,28.682984', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1245', '1239', '360112', '新建区', '3', '0791', '115.815277,28.692864', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1246', '1239', '360121', '南昌县', '3', '0791', '115.933742,28.558296', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1247', '1239', '360123', '安义县', '3', '0791', '115.548658,28.846', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1248', '1239', '360124', '进贤县', '3', '0791', '116.241288,28.377343', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1249', '1238', '360200', '景德镇市', '2', '0798', '117.178222,29.268945', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1250', '1249', '360202', '昌江区', '3', '0798', '117.18363,29.273565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1251', '1249', '360203', '珠山区', '3', '0798', '117.202919,29.299938', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1252', '1249', '360222', '浮梁县', '3', '0798', '117.215066,29.352253', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1253', '1249', '360281', '乐平市', '3', '0798', '117.151796,28.97844', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1254', '1238', '360300', '萍乡市', '2', '0799', '113.887083,27.658373', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1255', '1254', '360302', '安源区', '3', '0799', '113.870704,27.61511', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1256', '1254', '360313', '湘东区', '3', '0799', '113.733047,27.640075', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1257', '1254', '360321', '莲花县', '3', '0799', '113.961488,27.127664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1258', '1254', '360322', '上栗县', '3', '0799', '113.795311,27.880301', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1259', '1254', '360323', '芦溪县', '3', '0799', '114.029827,27.630806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1260', '1238', '360400', '九江市', '2', '0792', '115.952914,29.662117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1261', '1260', '360402', '濂溪区', '3', '0792', '115.992842,29.668064', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1262', '1260', '360403', '浔阳区', '3', '0792', '115.990301,29.727593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1263', '1260', '360421', '九江县', '3', '0792', '115.911323,29.608431', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1264', '1260', '360423', '武宁县', '3', '0792', '115.092757,29.246591', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1265', '1260', '360424', '修水县', '3', '0792', '114.546836,29.025726', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1266', '1260', '360425', '永修县', '3', '0792', '115.831956,29.011871', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1267', '1260', '360426', '德安县', '3', '0792', '115.767447,29.298696', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1268', '1260', '360483', '庐山市', '3', '0792', '116.04506,29.448128', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1269', '1260', '360428', '都昌县', '3', '0792', '116.203979,29.273239', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1270', '1260', '360429', '湖口县', '3', '0792', '116.251947,29.731101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1271', '1260', '360430', '彭泽县', '3', '0792', '116.56438,29.876991', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1272', '1260', '360481', '瑞昌市', '3', '0792', '115.681335,29.675834', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1273', '1260', '360482', '共青城市', '3', '0792', '115.808844,29.248316', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1274', '1238', '360500', '新余市', '2', '0790', '114.917346,27.817808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1275', '1274', '360502', '渝水区', '3', '0790', '114.944549,27.800148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1276', '1274', '360521', '分宜县', '3', '0790', '114.692049,27.814757', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1277', '1238', '360600', '鹰潭市', '2', '0701', '117.042173,28.272537', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1278', '1277', '360602', '月湖区', '3', '0701', '117.102475,28.267018', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1279', '1277', '360622', '余江县', '3', '0701', '116.85926,28.198652', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1280', '1277', '360681', '贵溪市', '3', '0701', '117.245497,28.292519', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1281', '1238', '360700', '赣州市', '2', '0797', '114.933546,25.830694', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1282', '1281', '360702', '章贡区', '3', '0797', '114.921171,25.817816', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1283', '1281', '360703', '南康区', '3', '0797', '114.765412,25.66145', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1284', '1281', '360704', '赣县区', '3', '0797', '115.011561,25.86069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1285', '1281', '360722', '信丰县', '3', '0797', '114.922922,25.386379', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1286', '1281', '360723', '大余县', '3', '0797', '114.362112,25.401313', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1287', '1281', '360724', '上犹县', '3', '0797', '114.551138,25.785172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1288', '1281', '360725', '崇义县', '3', '0797', '114.308267,25.681784', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1289', '1281', '360726', '安远县', '3', '0797', '115.393922,25.136927', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1290', '1281', '360727', '龙南县', '3', '0797', '114.789873,24.911069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1291', '1281', '360728', '定南县', '3', '0797', '115.027845,24.78441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1292', '1281', '360729', '全南县', '3', '0797', '114.530125,24.742403', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1293', '1281', '360730', '宁都县', '3', '0797', '116.009472,26.470116', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1294', '1281', '360731', '于都县', '3', '0797', '115.415508,25.952068', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1295', '1281', '360732', '兴国县', '3', '0797', '115.363189,26.337937', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1296', '1281', '360733', '会昌县', '3', '0797', '115.786056,25.600272', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1297', '1281', '360734', '寻乌县', '3', '0797', '115.637933,24.969167', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1298', '1281', '360735', '石城县', '3', '0797', '116.346995,26.314775', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1299', '1281', '360781', '瑞金市', '3', '0797', '116.027134,25.885555', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1300', '1238', '360800', '吉安市', '2', '0796', '114.966567,27.090763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1301', '1300', '360802', '吉州区', '3', '0796', '114.994763,27.143801', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1302', '1300', '360803', '青原区', '3', '0796', '115.014811,27.081977', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1303', '1300', '360821', '吉安县', '3', '0796', '114.907875,27.039787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1304', '1300', '360822', '吉水县', '3', '0796', '115.135507,27.229632', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1305', '1300', '360823', '峡江县', '3', '0796', '115.316566,27.582901', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1306', '1300', '360824', '新干县', '3', '0796', '115.387052,27.740191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1307', '1300', '360825', '永丰县', '3', '0796', '115.421344,27.316939', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1308', '1300', '360826', '泰和县', '3', '0796', '114.92299,26.801628', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1309', '1300', '360827', '遂川县', '3', '0796', '114.520537,26.313737', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1310', '1300', '360828', '万安县', '3', '0796', '114.759364,26.456553', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1311', '1300', '360829', '安福县', '3', '0796', '114.619893,27.392873', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1312', '1300', '360830', '永新县', '3', '0796', '114.243072,26.944962', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1313', '1300', '360881', '井冈山市', '3', '0796', '114.289228,26.748081', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1314', '1238', '360900', '宜春市', '2', '0795', '114.416785,27.815743', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1315', '1314', '360902', '袁州区', '3', '0795', '114.427858,27.797091', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1316', '1314', '360921', '奉新县', '3', '0795', '115.400491,28.688423', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1317', '1314', '360922', '万载县', '3', '0795', '114.444854,28.105689', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1318', '1314', '360923', '上高县', '3', '0795', '114.947683,28.238061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1319', '1314', '360924', '宜丰县', '3', '0795', '114.802852,28.394565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1320', '1314', '360925', '靖安县', '3', '0795', '115.362628,28.861478', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1321', '1314', '360926', '铜鼓县', '3', '0795', '114.371172,28.520769', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1322', '1314', '360981', '丰城市', '3', '0795', '115.771093,28.159141', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1323', '1314', '360982', '樟树市', '3', '0795', '115.546152,28.055853', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1324', '1314', '360983', '高安市', '3', '0795', '115.360619,28.441152', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1325', '1238', '361000', '抚州市', '2', '0794', '116.358181,27.949217', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1326', '1325', '361002', '临川区', '3', '0794', '116.312166,27.934572', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1327', '1325', '361021', '南城县', '3', '0794', '116.63704,27.569678', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1328', '1325', '361022', '黎川县', '3', '0794', '116.907681,27.282333', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1329', '1325', '361023', '南丰县', '3', '0794', '116.525725,27.218444', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1330', '1325', '361024', '崇仁县', '3', '0794', '116.07626,27.754466', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1331', '1325', '361025', '乐安县', '3', '0794', '115.83048,27.428765', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1332', '1325', '361026', '宜黄县', '3', '0794', '116.236201,27.554886', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1333', '1325', '361027', '金溪县', '3', '0794', '116.755058,27.918959', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1334', '1325', '361028', '资溪县', '3', '0794', '117.060263,27.706101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1335', '1325', '361003', '东乡区', '3', '0794', '116.603559,28.247696', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1336', '1325', '361030', '广昌县', '3', '0794', '116.335686,26.843684', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1337', '1238', '361100', '上饶市', '2', '0793', '117.943433,28.454863', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1338', '1337', '361102', '信州区', '3', '0793', '117.966268,28.431006', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1339', '1337', '361103', '广丰区', '3', '0793', '118.19124,28.436285', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1340', '1337', '361121', '上饶县', '3', '0793', '117.907849,28.448982', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1341', '1337', '361123', '玉山县', '3', '0793', '118.244769,28.682309', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1342', '1337', '361124', '铅山县', '3', '0793', '117.709659,28.315664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1343', '1337', '361125', '横峰县', '3', '0793', '117.596452,28.407117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1344', '1337', '361126', '弋阳县', '3', '0793', '117.449588,28.378044', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1345', '1337', '361127', '余干县', '3', '0793', '116.695646,28.702302', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1346', '1337', '361128', '鄱阳县', '3', '0793', '116.70359,29.004847', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1347', '1337', '361129', '万年县', '3', '0793', '117.058445,28.694582', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1348', '1337', '361130', '婺源县', '3', '0793', '117.861797,29.248085', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1349', '1337', '361181', '德兴市', '3', '0793', '117.578713,28.946464', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1350', '-1', '370000', '山东省', '1', '[]', '117.019915,36.671156', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1351', '1350', '370100', '济南市', '2', '0531', '117.120098,36.6512', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1352', '1351', '370102', '历下区', '3', '0531', '117.076441,36.666465', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1353', '1351', '370103', '市中区', '3', '0531', '116.997845,36.651335', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1354', '1351', '370104', '槐荫区', '3', '0531', '116.901224,36.651441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1355', '1351', '370105', '天桥区', '3', '0531', '116.987153,36.678589', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1356', '1351', '370112', '历城区', '3', '0531', '117.06523,36.680259', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1357', '1351', '370113', '长清区', '3', '0531', '116.751843,36.55371', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1358', '1351', '370124', '平阴县', '3', '0531', '116.456006,36.289251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1359', '1351', '370125', '济阳县', '3', '0531', '117.173524,36.978537', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1360', '1351', '370126', '商河县', '3', '0531', '117.157232,37.309041', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1361', '1351', '370114', '章丘区', '3', '0531', '117.526228,36.681258', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1362', '1350', '370200', '青岛市', '2', '0532', '120.382621,36.067131', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1363', '1362', '370202', '市南区', '3', '0532', '120.412392,36.075651', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1364', '1362', '370203', '市北区', '3', '0532', '120.374701,36.0876', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1365', '1362', '370211', '黄岛区', '3', '0532', '120.198055,35.960933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1366', '1362', '370212', '崂山区', '3', '0532', '120.468956,36.107538', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1367', '1362', '370213', '李沧区', '3', '0532', '120.432922,36.145519', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1368', '1362', '370214', '城阳区', '3', '0532', '120.396256,36.307559', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1369', '1362', '370281', '胶州市', '3', '0532', '120.033382,36.26468', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1370', '1362', '370282', '即墨市', '3', '0532', '120.447158,36.389408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1371', '1362', '370283', '平度市', '3', '0532', '119.98842,36.776357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1372', '1362', '370285', '莱西市', '3', '0532', '120.51769,36.889084', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1373', '1350', '370300', '淄博市', '2', '0533', '118.055019,36.813546', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1374', '1373', '370302', '淄川区', '3', '0533', '117.966723,36.643452', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1375', '1373', '370303', '张店区', '3', '0533', '118.017938,36.806669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1376', '1373', '370304', '博山区', '3', '0533', '117.861851,36.494701', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1377', '1373', '370305', '临淄区', '3', '0533', '118.309118,36.826981', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1378', '1373', '370306', '周村区', '3', '0533', '117.869886,36.803072', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1379', '1373', '370321', '桓台县', '3', '0533', '118.097922,36.959804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1380', '1373', '370322', '高青县', '3', '0533', '117.826924,37.170979', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1381', '1373', '370323', '沂源县', '3', '0533', '118.170855,36.185038', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1382', '1350', '370400', '枣庄市', '2', '0632', '117.323725,34.810488', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1383', '1382', '370402', '市中区', '3', '0632', '117.556139,34.863554', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1384', '1382', '370403', '薛城区', '3', '0632', '117.263164,34.795062', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1385', '1382', '370404', '峄城区', '3', '0632', '117.590816,34.773263', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1386', '1382', '370405', '台儿庄区', '3', '0632', '117.734414,34.56244', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1387', '1382', '370406', '山亭区', '3', '0632', '117.461517,35.099528', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1388', '1382', '370481', '滕州市', '3', '0632', '117.165824,35.114155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1389', '1350', '370500', '东营市', '2', '0546', '118.674614,37.433963', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1390', '1389', '370502', '东营区', '3', '0546', '118.582184,37.448964', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1391', '1389', '370503', '河口区', '3', '0546', '118.525543,37.886162', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1392', '1389', '370505', '垦利区', '3', '0546', '118.575228,37.573054', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1393', '1389', '370522', '利津县', '3', '0546', '118.255287,37.490328', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1394', '1389', '370523', '广饶县', '3', '0546', '118.407107,37.053555', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1395', '1350', '370600', '烟台市', '2', '0535', '121.447852,37.464539', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1396', '1395', '370602', '芝罘区', '3', '0535', '121.400445,37.541475', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1397', '1395', '370611', '福山区', '3', '0535', '121.267741,37.498246', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1398', '1395', '370612', '牟平区', '3', '0535', '121.600455,37.387061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1399', '1395', '370613', '莱山区', '3', '0535', '121.445301,37.511291', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1400', '1395', '370634', '长岛县', '3', '0535', '120.73658,37.921368', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1401', '1395', '370681', '龙口市', '3', '0535', '120.477813,37.646107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1402', '1395', '370682', '莱阳市', '3', '0535', '120.711672,36.978941', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1403', '1395', '370683', '莱州市', '3', '0535', '119.942274,37.177129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1404', '1395', '370684', '蓬莱市', '3', '0535', '120.758848,37.810661', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1405', '1395', '370685', '招远市', '3', '0535', '120.434071,37.355469', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1406', '1395', '370686', '栖霞市', '3', '0535', '120.849675,37.335123', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1407', '1395', '370687', '海阳市', '3', '0535', '121.173793,36.688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1408', '1350', '370700', '潍坊市', '2', '0536', '119.161748,36.706962', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1409', '1408', '370702', '潍城区', '3', '0536', '119.024835,36.7281', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1410', '1408', '370703', '寒亭区', '3', '0536', '119.211157,36.755623', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1411', '1408', '370704', '坊子区', '3', '0536', '119.166485,36.654448', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1412', '1408', '370705', '奎文区', '3', '0536', '119.132482,36.70759', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1413', '1408', '370724', '临朐县', '3', '0536', '118.542982,36.512506', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1414', '1408', '370725', '昌乐县', '3', '0536', '118.829992,36.706964', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1415', '1408', '370781', '青州市', '3', '0536', '118.479654,36.684789', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1416', '1408', '370782', '诸城市', '3', '0536', '119.410103,35.995654', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1417', '1408', '370783', '寿光市', '3', '0536', '118.790739,36.85576', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1418', '1408', '370784', '安丘市', '3', '0536', '119.218978,36.478493', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1419', '1408', '370785', '高密市', '3', '0536', '119.755597,36.382594', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1420', '1408', '370786', '昌邑市', '3', '0536', '119.403069,36.843319', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1421', '1350', '370800', '济宁市', '2', '0537', '116.587282,35.414982', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1422', '1421', '370811', '任城区', '3', '0537', '116.606103,35.444028', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1423', '1421', '370812', '兖州区', '3', '0537', '116.783833,35.553144', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1424', '1421', '370826', '微山县', '3', '0537', '117.128827,34.806554', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1425', '1421', '370827', '鱼台县', '3', '0537', '116.650608,35.012749', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1426', '1421', '370828', '金乡县', '3', '0537', '116.311532,35.066619', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1427', '1421', '370829', '嘉祥县', '3', '0537', '116.342449,35.408824', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1428', '1421', '370830', '汶上县', '3', '0537', '116.49708,35.712298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1429', '1421', '370831', '泗水县', '3', '0537', '117.251195,35.664323', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1430', '1421', '370832', '梁山县', '3', '0537', '116.096044,35.802306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1431', '1421', '370881', '曲阜市', '3', '0537', '116.986526,35.581108', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1432', '1421', '370883', '邹城市', '3', '0537', '117.007453,35.40268', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1433', '1350', '370900', '泰安市', '2', '0538', '117.087614,36.200252', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1434', '1433', '370902', '泰山区', '3', '0538', '117.135354,36.192083', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1435', '1433', '370911', '岱岳区', '3', '0538', '117.041581,36.187989', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1436', '1433', '370921', '宁阳县', '3', '0538', '116.805796,35.758786', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1437', '1433', '370923', '东平县', '3', '0538', '116.470304,35.937102', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1438', '1433', '370982', '新泰市', '3', '0538', '117.767952,35.909032', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1439', '1433', '370983', '肥城市', '3', '0538', '116.768358,36.182571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1440', '1350', '371000', '威海市', '2', '0631', '122.120282,37.513412', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1441', '1440', '371002', '环翠区', '3', '0631', '122.123443,37.50199', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1442', '1440', '371003', '文登区', '3', '0631', '122.05767,37.193735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1443', '1440', '371082', '荣成市', '3', '0631', '122.486657,37.16516', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1444', '1440', '371083', '乳山市', '3', '0631', '121.539764,36.919816', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1445', '1350', '371100', '日照市', '2', '0633', '119.526925,35.416734', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1446', '1445', '371102', '东港区', '3', '0633', '119.462267,35.42548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1447', '1445', '371103', '岚山区', '3', '0633', '119.318928,35.121884', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1448', '1445', '371121', '五莲县', '3', '0633', '119.213619,35.760228', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1449', '1445', '371122', '莒县', '3', '0633', '118.837063,35.579868', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1450', '1350', '371200', '莱芜市', '2', '0634', '117.676723,36.213813', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1451', '1450', '371202', '莱城区', '3', '0634', '117.659884,36.203179', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1452', '1450', '371203', '钢城区', '3', '0634', '117.811354,36.058572', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1453', '1350', '371300', '临沂市', '2', '0539', '118.356414,35.104673', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1454', '1453', '371302', '兰山区', '3', '0539', '118.347842,35.051804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1455', '1453', '371311', '罗庄区', '3', '0539', '118.284786,34.996741', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1456', '1453', '371312', '河东区', '3', '0539', '118.402893,35.089916', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1457', '1453', '371321', '沂南县', '3', '0539', '118.465221,35.550217', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1458', '1453', '371322', '郯城县', '3', '0539', '118.367215,34.613586', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1459', '1453', '371323', '沂水县', '3', '0539', '118.627917,35.79045', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1460', '1453', '371324', '兰陵县', '3', '0539', '118.07065,34.857149', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1461', '1453', '371325', '费县', '3', '0539', '117.977325,35.26596', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1462', '1453', '371326', '平邑县', '3', '0539', '117.640352,35.505943', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1463', '1453', '371327', '莒南县', '3', '0539', '118.835163,35.174846', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1464', '1453', '371328', '蒙阴县', '3', '0539', '117.953621,35.719396', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1465', '1453', '371329', '临沭县', '3', '0539', '118.650781,34.919851', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1466', '1350', '371400', '德州市', '2', '0534', '116.359381,37.436657', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1467', '1466', '371402', '德城区', '3', '0534', '116.29947,37.450804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1468', '1466', '371403', '陵城区', '3', '0534', '116.576092,37.335794', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1469', '1466', '371422', '宁津县', '3', '0534', '116.800306,37.652189', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1470', '1466', '371423', '庆云县', '3', '0534', '117.385256,37.775349', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1471', '1466', '371424', '临邑县', '3', '0534', '116.866799,37.189797', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1472', '1466', '371425', '齐河县', '3', '0534', '116.762893,36.784158', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1473', '1466', '371426', '平原县', '3', '0534', '116.434032,37.165323', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1474', '1466', '371427', '夏津县', '3', '0534', '116.001726,36.948371', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1475', '1466', '371428', '武城县', '3', '0534', '116.069302,37.213311', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1476', '1466', '371481', '乐陵市', '3', '0534', '117.231934,37.729907', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1477', '1466', '371482', '禹城市', '3', '0534', '116.638327,36.933812', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1478', '1350', '371500', '聊城市', '2', '0635', '115.985389,36.456684', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1479', '1478', '371502', '东昌府区', '3', '0635', '115.988349,36.434669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1480', '1478', '371521', '阳谷县', '3', '0635', '115.79182,36.114392', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1481', '1478', '371522', '莘县', '3', '0635', '115.671191,36.233598', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1482', '1478', '371523', '茌平县', '3', '0635', '116.25527,36.580688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1483', '1478', '371524', '东阿县', '3', '0635', '116.247579,36.334917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1484', '1478', '371525', '冠县', '3', '0635', '115.442739,36.484009', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1485', '1478', '371526', '高唐县', '3', '0635', '116.23016,36.846762', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1486', '1478', '371581', '临清市', '3', '0635', '115.704881,36.838277', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1487', '1350', '371600', '滨州市', '2', '0543', '117.970699,37.38198', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1488', '1487', '371602', '滨城区', '3', '0543', '118.019326,37.430724', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1489', '1487', '371603', '沾化区', '3', '0543', '118.098902,37.69926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1490', '1487', '371621', '惠民县', '3', '0543', '117.509921,37.489877', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1491', '1487', '371622', '阳信县', '3', '0543', '117.603339,37.632433', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1492', '1487', '371623', '无棣县', '3', '0543', '117.625696,37.77026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1493', '1487', '371625', '博兴县', '3', '0543', '118.110709,37.15457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1494', '1487', '371626', '邹平县', '3', '0543', '117.743109,36.862989', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1495', '1350', '371700', '菏泽市', '2', '0530', '115.480656,35.23375', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1496', '1495', '371702', '牡丹区', '3', '0530', '115.417826,35.252512', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1497', '1495', '371703', '定陶区', '3', '0530', '115.57302,35.070995', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1498', '1495', '371721', '曹县', '3', '0530', '115.542328,34.825508', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1499', '1495', '371722', '单县', '3', '0530', '116.107428,34.778808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1500', '1495', '371723', '成武县', '3', '0530', '115.889764,34.952459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1501', '1495', '371724', '巨野县', '3', '0530', '116.062394,35.388925', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1502', '1495', '371725', '郓城县', '3', '0530', '115.9389,35.575135', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1503', '1495', '371726', '鄄城县', '3', '0530', '115.510192,35.563408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1504', '1495', '371728', '东明县', '3', '0530', '115.107404,35.276162', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1505', '-1', '410000', '河南省', '1', '[]', '113.753394,34.765869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1506', '1505', '410100', '郑州市', '2', '0371', '113.625328,34.746611', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1507', '1506', '410102', '中原区', '3', '0371', '113.613337,34.748256', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1508', '1506', '410103', '二七区', '3', '0371', '113.640211,34.724114', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1509', '1506', '410104', '管城回族区', '3', '0371', '113.6775,34.75429', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1510', '1506', '410105', '金水区', '3', '0371', '113.660617,34.800004', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1511', '1506', '410106', '上街区', '3', '0371', '113.30893,34.802752', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1512', '1506', '410108', '惠济区', '3', '0371', '113.6169,34.867457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1513', '1506', '410122', '中牟县', '3', '0371', '113.976253,34.718936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1514', '1506', '410181', '巩义市', '3', '0371', '113.022406,34.7481', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1515', '1506', '410182', '荥阳市', '3', '0371', '113.38324,34.786948', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1516', '1506', '410183', '新密市', '3', '0371', '113.391087,34.539376', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1517', '1506', '410184', '新郑市', '3', '0371', '113.740662,34.395949', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1518', '1506', '410185', '登封市', '3', '0371', '113.050581,34.454443', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1519', '1505', '410200', '开封市', '2', '0378', '114.307677,34.797966', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1520', '1519', '410202', '龙亭区', '3', '0378', '114.356076,34.815565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1521', '1519', '410203', '顺河回族区', '3', '0378', '114.364875,34.800458', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1522', '1519', '410204', '鼓楼区', '3', '0378', '114.348306,34.78856', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1523', '1519', '410205', '禹王台区', '3', '0378', '114.34817,34.777104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1524', '1519', '410212', '祥符区', '3', '0378', '114.441285,34.756916', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1525', '1519', '410221', '杞县', '3', '0378', '114.783139,34.549174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1526', '1519', '410222', '通许县', '3', '0378', '114.467467,34.480433', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1527', '1519', '410223', '尉氏县', '3', '0378', '114.193081,34.411494', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1528', '1519', '410225', '兰考县', '3', '0378', '114.821348,34.822211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1529', '1505', '410300', '洛阳市', '2', '0379', '112.453926,34.620202', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1530', '1529', '410302', '老城区', '3', '0379', '112.469766,34.6842', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1531', '1529', '410303', '西工区', '3', '0379', '112.427914,34.660378', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1532', '1529', '410304', '瀍河回族区', '3', '0379', '112.500131,34.679773', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1533', '1529', '410305', '涧西区', '3', '0379', '112.395756,34.658033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1534', '1529', '410306', '吉利区', '3', '0379', '112.589112,34.900467', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1535', '1529', '410311', '洛龙区', '3', '0379', '112.463833,34.619711', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1536', '1529', '410322', '孟津县', '3', '0379', '112.445354,34.825638', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1537', '1529', '410323', '新安县', '3', '0379', '112.13244,34.728284', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1538', '1529', '410324', '栾川县', '3', '0379', '111.615768,33.785698', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1539', '1529', '410325', '嵩县', '3', '0379', '112.085634,34.134516', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1540', '1529', '410326', '汝阳县', '3', '0379', '112.473139,34.153939', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1541', '1529', '410327', '宜阳县', '3', '0379', '112.179238,34.514644', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1542', '1529', '410328', '洛宁县', '3', '0379', '111.653111,34.389197', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1543', '1529', '410329', '伊川县', '3', '0379', '112.425676,34.421323', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1544', '1529', '410381', '偃师市', '3', '0379', '112.789534,34.72722', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1545', '1505', '410400', '平顶山市', '2', '0375', '113.192661,33.766169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1546', '1545', '410402', '新华区', '3', '0375', '113.293977,33.737251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1547', '1545', '410403', '卫东区', '3', '0375', '113.335192,33.734706', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1548', '1545', '410404', '石龙区', '3', '0375', '112.898818,33.898713', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1549', '1545', '410411', '湛河区', '3', '0375', '113.320873,33.725681', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1550', '1545', '410421', '宝丰县', '3', '0375', '113.054801,33.868434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1551', '1545', '410422', '叶县', '3', '0375', '113.357239,33.626731', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1552', '1545', '410423', '鲁山县', '3', '0375', '112.908202,33.738293', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1553', '1545', '410425', '郏县', '3', '0375', '113.212609,33.971787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1554', '1545', '410481', '舞钢市', '3', '0375', '113.516343,33.314033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1555', '1545', '410482', '汝州市', '3', '0375', '112.844517,34.167029', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1556', '1505', '410500', '安阳市', '2', '0372', '114.392392,36.097577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1557', '1556', '410502', '文峰区', '3', '0372', '114.357082,36.090468', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1558', '1556', '410503', '北关区', '3', '0372', '114.355742,36.10766', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1559', '1556', '410505', '殷都区', '3', '0372', '114.303553,36.10989', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1560', '1556', '410506', '龙安区', '3', '0372', '114.301331,36.076225', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1561', '1556', '410522', '安阳县', '3', '0372', '114.130207,36.130584', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1562', '1556', '410523', '汤阴县', '3', '0372', '114.357763,35.924514', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1563', '1556', '410526', '滑县', '3', '0372', '114.519311,35.575417', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1564', '1556', '410527', '内黄县', '3', '0372', '114.901452,35.971704', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1565', '1556', '410581', '林州市', '3', '0372', '113.820129,36.083046', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1566', '1505', '410600', '鹤壁市', '2', '0392', '114.297309,35.748325', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1567', '1566', '410602', '鹤山区', '3', '0392', '114.163258,35.954611', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1568', '1566', '410603', '山城区', '3', '0392', '114.184318,35.898033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1569', '1566', '410611', '淇滨区', '3', '0392', '114.298789,35.741592', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1570', '1566', '410621', '浚县', '3', '0392', '114.55091,35.67636', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1571', '1566', '410622', '淇县', '3', '0392', '114.208828,35.622507', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1572', '1505', '410700', '新乡市', '2', '0373', '113.926763,35.303704', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1573', '1572', '410702', '红旗区', '3', '0373', '113.875245,35.30385', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1574', '1572', '410703', '卫滨区', '3', '0373', '113.865663,35.301992', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1575', '1572', '410704', '凤泉区', '3', '0373', '113.915184,35.383978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1576', '1572', '410711', '牧野区', '3', '0373', '113.908772,35.315039', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1577', '1572', '410721', '新乡县', '3', '0373', '113.805205,35.190836', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1578', '1572', '410724', '获嘉县', '3', '0373', '113.657433,35.259808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1579', '1572', '410725', '原阳县', '3', '0373', '113.940046,35.065587', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1580', '1572', '410726', '延津县', '3', '0373', '114.20509,35.141889', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1581', '1572', '410727', '封丘县', '3', '0373', '114.418882,35.041198', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1582', '1572', '410728', '长垣县', '3', '0373', '114.668936,35.201548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1583', '1572', '410781', '卫辉市', '3', '0373', '114.064907,35.398494', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1584', '1572', '410782', '辉县市', '3', '0373', '113.805468,35.462312', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1585', '1505', '410800', '焦作市', '2', '0391', '113.241823,35.215893', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1586', '1585', '410802', '解放区', '3', '0391', '113.230816,35.240282', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1587', '1585', '410803', '中站区', '3', '0391', '113.182946,35.236819', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1588', '1585', '410804', '马村区', '3', '0391', '113.322332,35.256108', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1589', '1585', '410811', '山阳区', '3', '0391', '113.254881,35.214507', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1590', '1585', '410821', '修武县', '3', '0391', '113.447755,35.223514', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1591', '1585', '410822', '博爱县', '3', '0391', '113.064379,35.171045', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1592', '1585', '410823', '武陟县', '3', '0391', '113.401679,35.099378', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1593', '1585', '410825', '温县', '3', '0391', '113.08053,34.940189', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1594', '1585', '410882', '沁阳市', '3', '0391', '112.950716,35.087539', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1595', '1585', '410883', '孟州市', '3', '0391', '112.791401,34.907315', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1596', '1505', '410900', '濮阳市', '2', '0393', '115.029216,35.761829', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1597', '1596', '410902', '华龙区', '3', '0393', '115.074151,35.777346', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1598', '1596', '410922', '清丰县', '3', '0393', '115.104389,35.88518', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1599', '1596', '410923', '南乐县', '3', '0393', '115.204675,36.069476', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1600', '1596', '410926', '范县', '3', '0393', '115.504201,35.851906', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1601', '1596', '410927', '台前县', '3', '0393', '115.871906,35.96939', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1602', '1596', '410928', '濮阳县', '3', '0393', '115.029078,35.712193', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1603', '1505', '411000', '许昌市', '2', '0374', '113.852454,34.035771', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1604', '1603', '411002', '魏都区', '3', '0374', '113.822647,34.025341', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1605', '1603', '411003', '建安区', '3', '0374', '113.822983,34.12466', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1606', '1603', '411024', '鄢陵县', '3', '0374', '114.177399,34.102332', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1607', '1603', '411025', '襄城县', '3', '0374', '113.505874,33.851459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1608', '1603', '411081', '禹州市', '3', '0374', '113.488478,34.140701', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1609', '1603', '411082', '长葛市', '3', '0374', '113.813714,34.19592', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1610', '1505', '411100', '漯河市', '2', '0395', '114.016536,33.580873', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1611', '1610', '411102', '源汇区', '3', '0395', '114.017948,33.565441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1612', '1610', '411103', '郾城区', '3', '0395', '114.006943,33.587409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1613', '1610', '411104', '召陵区', '3', '0395', '114.093902,33.586565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1614', '1610', '411121', '舞阳县', '3', '0395', '113.609286,33.437876', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1615', '1610', '411122', '临颍县', '3', '0395', '113.931261,33.828042', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1616', '1505', '411200', '三门峡市', '2', '0398', '111.200367,34.772792', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1617', '1616', '411202', '湖滨区', '3', '0398', '111.188397,34.770886', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1618', '1616', '411203', '陕州区', '3', '0398', '111.103563,34.720547', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1619', '1616', '411221', '渑池县', '3', '0398', '111.761797,34.767951', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1620', '1616', '411224', '卢氏县', '3', '0398', '111.047858,34.054324', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1621', '1616', '411281', '义马市', '3', '0398', '111.87448,34.7474', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1622', '1616', '411282', '灵宝市', '3', '0398', '110.89422,34.516828', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1623', '1505', '411300', '南阳市', '2', '0377', '112.528308,32.990664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1624', '1623', '411302', '宛城区', '3', '0377', '112.539558,33.003784', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1625', '1623', '411303', '卧龙区', '3', '0377', '112.528789,32.989877', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1626', '1623', '411321', '南召县', '3', '0377', '112.429133,33.489877', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1627', '1623', '411322', '方城县', '3', '0377', '113.012494,33.254391', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1628', '1623', '411323', '西峡县', '3', '0377', '111.47353,33.307294', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1629', '1623', '411324', '镇平县', '3', '0377', '112.234697,33.03411', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1630', '1623', '411325', '内乡县', '3', '0377', '111.849392,33.044864', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1631', '1623', '411326', '淅川县', '3', '0377', '111.490964,33.13782', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1632', '1623', '411327', '社旗县', '3', '0377', '112.948245,33.056109', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1633', '1623', '411328', '唐河县', '3', '0377', '112.807636,32.681335', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1634', '1623', '411329', '新野县', '3', '0377', '112.360026,32.520805', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1635', '1623', '411330', '桐柏县', '3', '0377', '113.428287,32.380073', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1636', '1623', '411381', '邓州市', '3', '0377', '112.087493,32.68758', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1637', '1505', '411400', '商丘市', '2', '0370', '115.656339,34.414961', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1638', '1637', '411402', '梁园区', '3', '0370', '115.613965,34.443893', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1639', '1637', '411403', '睢阳区', '3', '0370', '115.653301,34.388389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1640', '1637', '411421', '民权县', '3', '0370', '115.173971,34.648191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1641', '1637', '411422', '睢县', '3', '0370', '115.071879,34.445655', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1642', '1637', '411423', '宁陵县', '3', '0370', '115.313743,34.460399', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1643', '1637', '411424', '柘城县', '3', '0370', '115.305708,34.091082', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1644', '1637', '411425', '虞城县', '3', '0370', '115.828319,34.400835', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1645', '1637', '411426', '夏邑县', '3', '0370', '116.131447,34.237553', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1646', '1637', '411481', '永城市', '3', '0370', '116.4495,33.929291', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1647', '1505', '411500', '信阳市', '2', '0376', '114.091193,32.147679', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1648', '1647', '411502', '浉河区', '3', '0376', '114.058713,32.116803', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1649', '1647', '411503', '平桥区', '3', '0376', '114.125656,32.101031', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1650', '1647', '411521', '罗山县', '3', '0376', '114.512872,32.203883', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1651', '1647', '411522', '光山县', '3', '0376', '114.919152,32.010002', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1652', '1647', '411523', '新县', '3', '0376', '114.879239,31.643918', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1653', '1647', '411524', '商城县', '3', '0376', '115.406862,31.798377', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1654', '1647', '411525', '固始县', '3', '0376', '115.654481,32.168137', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1655', '1647', '411526', '潢川县', '3', '0376', '115.051908,32.131522', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1656', '1647', '411527', '淮滨县', '3', '0376', '115.419537,32.473258', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1657', '1647', '411528', '息县', '3', '0376', '114.740456,32.342792', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1658', '1505', '411600', '周口市', '2', '0394', '114.69695,33.626149', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1659', '1658', '411602', '川汇区', '3', '0394', '114.650628,33.647598', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1660', '1658', '411621', '扶沟县', '3', '0394', '114.394821,34.059968', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1661', '1658', '411622', '西华县', '3', '0394', '114.529756,33.767407', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1662', '1658', '411623', '商水县', '3', '0394', '114.611651,33.542138', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1663', '1658', '411624', '沈丘县', '3', '0394', '115.098583,33.409369', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1664', '1658', '411625', '郸城县', '3', '0394', '115.177188,33.644743', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1665', '1658', '411626', '淮阳县', '3', '0394', '114.886153,33.731561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1666', '1658', '411627', '太康县', '3', '0394', '114.837888,34.064463', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1667', '1658', '411628', '鹿邑县', '3', '0394', '115.484454,33.86', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1668', '1658', '411681', '项城市', '3', '0394', '114.875333,33.465838', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1669', '1505', '411700', '驻马店市', '2', '0396', '114.022247,33.012885', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1670', '1669', '411702', '驿城区', '3', '0396', '113.993914,32.973054', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1671', '1669', '411721', '西平县', '3', '0396', '114.021538,33.387684', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1672', '1669', '411722', '上蔡县', '3', '0396', '114.264381,33.262439', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1673', '1669', '411723', '平舆县', '3', '0396', '114.619159,32.96271', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1674', '1669', '411724', '正阳县', '3', '0396', '114.392773,32.605697', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1675', '1669', '411725', '确山县', '3', '0396', '114.026429,32.802064', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1676', '1669', '411726', '泌阳县', '3', '0396', '113.327144,32.723975', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1677', '1669', '411727', '汝南县', '3', '0396', '114.362379,33.006729', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1678', '1669', '411728', '遂平县', '3', '0396', '114.013182,33.145649', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1679', '1669', '411729', '新蔡县', '3', '0396', '114.96547,32.744896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1680', '1505', '419001', '济源市', '2', '1391', '112.602256,35.067199', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1681', '-1', '420000', '湖北省', '1', '[]', '114.341745,30.546557', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1682', '1681', '420100', '武汉市', '2', '027', '114.305469,30.593175', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1683', '1682', '420102', '江岸区', '3', '027', '114.30911,30.600052', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1684', '1682', '420103', '江汉区', '3', '027', '114.270867,30.601475', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1685', '1682', '420104', '硚口区', '3', '027', '114.21492,30.582202', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1686', '1682', '420105', '汉阳区', '3', '027', '114.21861,30.553983', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1687', '1682', '420106', '武昌区', '3', '027', '114.31665,30.554408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1688', '1682', '420107', '青山区', '3', '027', '114.384968,30.640191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1689', '1682', '420111', '洪山区', '3', '027', '114.343796,30.500247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1690', '1682', '420112', '东西湖区', '3', '027', '114.137116,30.619917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1691', '1682', '420113', '汉南区', '3', '027', '114.084597,30.308829', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1692', '1682', '420114', '蔡甸区', '3', '027', '114.087285,30.536454', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1693', '1682', '420115', '江夏区', '3', '027', '114.319097,30.376308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1694', '1682', '420116', '黄陂区', '3', '027', '114.375725,30.882174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1695', '1682', '420117', '新洲区', '3', '027', '114.801096,30.841425', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1696', '1681', '420200', '黄石市', '2', '0714', '115.038962,30.201038', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1697', '1696', '420202', '黄石港区', '3', '0714', '115.065849,30.222938', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1698', '1696', '420203', '西塞山区', '3', '0714', '115.109955,30.204924', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1699', '1696', '420204', '下陆区', '3', '0714', '114.961327,30.173912', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1700', '1696', '420205', '铁山区', '3', '0714', '114.891605,30.203118', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1701', '1696', '420222', '阳新县', '3', '0714', '115.215227,29.830257', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1702', '1696', '420281', '大冶市', '3', '0714', '114.980424,30.096147', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1703', '1681', '420300', '十堰市', '2', '0719', '110.799291,32.629462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1704', '1703', '420302', '茅箭区', '3', '0719', '110.813719,32.591904', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1705', '1703', '420303', '张湾区', '3', '0719', '110.769132,32.652297', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1706', '1703', '420304', '郧阳区', '3', '0719', '110.81205,32.834775', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1707', '1703', '420322', '郧西县', '3', '0719', '110.425983,32.993182', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1708', '1703', '420323', '竹山县', '3', '0719', '110.228747,32.224808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1709', '1703', '420324', '竹溪县', '3', '0719', '109.715304,32.318255', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1710', '1703', '420325', '房县', '3', '0719', '110.733181,32.050378', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1711', '1703', '420381', '丹江口市', '3', '0719', '111.513127,32.540157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1712', '1681', '420500', '宜昌市', '2', '0717', '111.286445,30.691865', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1713', '1712', '420502', '西陵区', '3', '0717', '111.285646,30.710781', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1714', '1712', '420503', '伍家岗区', '3', '0717', '111.361037,30.644334', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1715', '1712', '420504', '点军区', '3', '0717', '111.268119,30.693247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1716', '1712', '420505', '猇亭区', '3', '0717', '111.43462,30.530903', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1717', '1712', '420506', '夷陵区', '3', '0717', '111.32638,30.770006', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1718', '1712', '420525', '远安县', '3', '0717', '111.640508,31.060869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1719', '1712', '420526', '兴山县', '3', '0717', '110.746804,31.348196', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1720', '1712', '420527', '秭归县', '3', '0717', '110.977711,30.825897', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1721', '1712', '420528', '长阳土家族自治县', '3', '0717', '111.207242,30.472763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1722', '1712', '420529', '五峰土家族自治县', '3', '0717', '111.07374,30.156741', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1723', '1712', '420581', '宜都市', '3', '0717', '111.450096,30.378299', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1724', '1712', '420582', '当阳市', '3', '0717', '111.788312,30.821266', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1725', '1712', '420583', '枝江市', '3', '0717', '111.76053,30.42594', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1726', '1681', '420600', '襄阳市', '2', '0710', '112.122426,32.009016', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1727', '1726', '420602', '襄城区', '3', '0710', '112.134052,32.010366', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1728', '1726', '420606', '樊城区', '3', '0710', '112.135684,32.044832', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1729', '1726', '420607', '襄州区', '3', '0710', '112.211982,32.087127', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1730', '1726', '420624', '南漳县', '3', '0710', '111.838905,31.774636', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1731', '1726', '420625', '谷城县', '3', '0710', '111.652982,32.263849', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1732', '1726', '420626', '保康县', '3', '0710', '111.261308,31.87831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1733', '1726', '420682', '老河口市', '3', '0710', '111.683861,32.359068', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1734', '1726', '420683', '枣阳市', '3', '0710', '112.771959,32.128818', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1735', '1726', '420684', '宜城市', '3', '0710', '112.257788,31.719806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1736', '1681', '420700', '鄂州市', '2', '0711', '114.894935,30.391141', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1737', '1736', '420702', '梁子湖区', '3', '0711', '114.684731,30.100141', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1738', '1736', '420703', '华容区', '3', '0711', '114.729878,30.534309', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1739', '1736', '420704', '鄂城区', '3', '0711', '114.891586,30.400651', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1740', '1681', '420800', '荆门市', '2', '0724', '112.199427,31.035395', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1741', '1740', '420802', '东宝区', '3', '0724', '112.201493,31.051852', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1742', '1740', '420804', '掇刀区', '3', '0724', '112.207962,30.973451', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1743', '1740', '420821', '京山县', '3', '0724', '113.119566,31.018457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1744', '1740', '420822', '沙洋县', '3', '0724', '112.588581,30.709221', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1745', '1740', '420881', '钟祥市', '3', '0724', '112.58812,31.167819', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1746', '1681', '420900', '孝感市', '2', '0712', '113.957037,30.917766', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1747', '1746', '420902', '孝南区', '3', '0712', '113.910705,30.916812', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1748', '1746', '420921', '孝昌县', '3', '0712', '113.998009,31.258159', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1749', '1746', '420922', '大悟县', '3', '0712', '114.127022,31.561164', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1750', '1746', '420923', '云梦县', '3', '0712', '113.753554,31.020983', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1751', '1746', '420981', '应城市', '3', '0712', '113.572707,30.92837', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1752', '1746', '420982', '安陆市', '3', '0712', '113.688941,31.25561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1753', '1746', '420984', '汉川市', '3', '0712', '113.839149,30.661243', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1754', '1681', '421000', '荆州市', '2', '0716', '112.239746,30.335184', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1755', '1754', '421002', '沙市区', '3', '0716', '112.25193,30.326009', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1756', '1754', '421003', '荆州区', '3', '0716', '112.190185,30.352853', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1757', '1754', '421022', '公安县', '3', '0716', '112.229648,30.058336', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1758', '1754', '421023', '监利县', '3', '0716', '112.904788,29.840179', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1759', '1754', '421024', '江陵县', '3', '0716', '112.424664,30.041822', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1760', '1754', '421081', '石首市', '3', '0716', '112.425454,29.720938', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1761', '1754', '421083', '洪湖市', '3', '0716', '113.475801,29.826916', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1762', '1754', '421087', '松滋市', '3', '0716', '111.756781,30.174529', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1763', '1681', '421100', '黄冈市', '2', '0713', '114.872199,30.453667', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1764', '1763', '421102', '黄州区', '3', '0713', '114.880104,30.434354', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1765', '1763', '421121', '团风县', '3', '0713', '114.872191,30.643569', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1766', '1763', '421122', '红安县', '3', '0713', '114.618236,31.288153', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1767', '1763', '421123', '罗田县', '3', '0713', '115.399222,30.78429', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1768', '1763', '421124', '英山县', '3', '0713', '115.681359,30.735157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1769', '1763', '421125', '浠水县', '3', '0713', '115.265355,30.452115', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1770', '1763', '421126', '蕲春县', '3', '0713', '115.437007,30.225964', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1771', '1763', '421127', '黄梅县', '3', '0713', '115.944219,30.070453', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1772', '1763', '421181', '麻城市', '3', '0713', '115.008163,31.172739', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1773', '1763', '421182', '武穴市', '3', '0713', '115.561217,29.844107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1774', '1681', '421200', '咸宁市', '2', '0715', '114.322616,29.841362', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1775', '1774', '421202', '咸安区', '3', '0715', '114.298711,29.852891', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1776', '1774', '421221', '嘉鱼县', '3', '0715', '113.939271,29.970676', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1777', '1774', '421222', '通城县', '3', '0715', '113.816966,29.245269', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1778', '1774', '421223', '崇阳县', '3', '0715', '114.039523,29.556688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1779', '1774', '421224', '通山县', '3', '0715', '114.482622,29.606372', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1780', '1774', '421281', '赤壁市', '3', '0715', '113.90038,29.725184', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1781', '1681', '421300', '随州市', '2', '0722', '113.382515,31.690191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1782', '1781', '421303', '曾都区', '3', '0722', '113.37112,31.71628', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1783', '1781', '421321', '随县', '3', '0722', '113.290634,31.883739', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1784', '1781', '421381', '广水市', '3', '0722', '113.825889,31.616853', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1785', '1681', '422800', '恩施土家族苗族自治州', '2', '0718', '109.488172,30.272156', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1786', '1785', '422801', '恩施市', '3', '0718', '109.479664,30.29468', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1787', '1785', '422802', '利川市', '3', '0718', '108.936452,30.29098', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1788', '1785', '422822', '建始县', '3', '0718', '109.722109,30.602129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1789', '1785', '422823', '巴东县', '3', '0718', '110.340756,31.042324', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1790', '1785', '422825', '宣恩县', '3', '0718', '109.489926,29.98692', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1791', '1785', '422826', '咸丰县', '3', '0718', '109.139726,29.665202', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1792', '1785', '422827', '来凤县', '3', '0718', '109.407828,29.493484', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1793', '1785', '422828', '鹤峰县', '3', '0718', '110.033662,29.890171', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1794', '1681', '429005', '潜江市', '2', '2728', '112.899762,30.402167', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1795', '1681', '429021', '神农架林区', '2', '1719', '110.675743,31.744915', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1796', '1681', '429006', '天门市', '2', '1728', '113.166078,30.663337', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1797', '1681', '429004', '仙桃市', '2', '0728', '113.423583,30.361438', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1798', '-1', '430000', '湖南省', '1', '[]', '112.9836,28.112743', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1799', '1798', '430100', '长沙市', '2', '0731', '112.938884,28.22808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1800', '1799', '430102', '芙蓉区', '3', '0731', '113.032539,28.185389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1801', '1799', '430103', '天心区', '3', '0731', '112.989897,28.114526', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1802', '1799', '430104', '岳麓区', '3', '0731', '112.93132,28.234538', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1803', '1799', '430105', '开福区', '3', '0731', '112.985884,28.256298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1804', '1799', '430111', '雨花区', '3', '0731', '113.03826,28.135722', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1805', '1799', '430112', '望城区', '3', '0731', '112.831176,28.353434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1806', '1799', '430121', '长沙县', '3', '0731', '113.081097,28.246918', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1807', '1799', '430124', '宁乡市', '3', '0731', '112.551885,28.277483', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1808', '1799', '430181', '浏阳市', '3', '0731', '113.643076,28.162833', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1809', '1798', '430200', '株洲市', '2', '0733', '113.133853,27.827986', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1810', '1809', '430202', '荷塘区', '3', '0733', '113.173487,27.855928', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1811', '1809', '430203', '芦淞区', '3', '0733', '113.152724,27.78507', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1812', '1809', '430204', '石峰区', '3', '0733', '113.117731,27.875445', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1813', '1809', '430211', '天元区', '3', '0733', '113.082216,27.826866', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1814', '1809', '430221', '株洲县', '3', '0733', '113.144109,27.699232', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1815', '1809', '430223', '攸县', '3', '0733', '113.396385,27.014583', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1816', '1809', '430224', '茶陵县', '3', '0733', '113.539094,26.777521', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1817', '1809', '430225', '炎陵县', '3', '0733', '113.772655,26.489902', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1818', '1809', '430281', '醴陵市', '3', '0733', '113.496999,27.646096', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1819', '1798', '430300', '湘潭市', '2', '0732', '112.944026,27.829795', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1820', '1819', '430302', '雨湖区', '3', '0732', '112.907162,27.856325', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1821', '1819', '430304', '岳塘区', '3', '0732', '112.969479,27.872028', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1822', '1819', '430321', '湘潭县', '3', '0732', '112.950831,27.778958', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1823', '1819', '430381', '湘乡市', '3', '0732', '112.550205,27.718549', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1824', '1819', '430382', '韶山市', '3', '0732', '112.52667,27.915008', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1825', '1798', '430400', '衡阳市', '2', '0734', '112.572018,26.893368', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1826', '1825', '430405', '珠晖区', '3', '0734', '112.620209,26.894765', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1827', '1825', '430406', '雁峰区', '3', '0734', '112.6154,26.840602', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1828', '1825', '430407', '石鼓区', '3', '0734', '112.597992,26.943755', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1829', '1825', '430408', '蒸湘区', '3', '0734', '112.567107,26.911854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1830', '1825', '430412', '南岳区', '3', '0734', '112.738604,27.232443', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1831', '1825', '430421', '衡阳县', '3', '0734', '112.370546,26.969577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1832', '1825', '430422', '衡南县', '3', '0734', '112.677877,26.738247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1833', '1825', '430423', '衡山县', '3', '0734', '112.868268,27.23029', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1834', '1825', '430424', '衡东县', '3', '0734', '112.953168,27.08117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1835', '1825', '430426', '祁东县', '3', '0734', '112.090356,26.799896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1836', '1825', '430481', '耒阳市', '3', '0734', '112.859759,26.422277', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1837', '1825', '430482', '常宁市', '3', '0734', '112.399878,26.421956', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1838', '1798', '430500', '邵阳市', '2', '0739', '111.467674,27.23895', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1839', '1838', '430502', '双清区', '3', '0739', '111.496341,27.232708', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1840', '1838', '430503', '大祥区', '3', '0739', '111.439091,27.221452', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1841', '1838', '430511', '北塔区', '3', '0739', '111.452196,27.246489', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1842', '1838', '430521', '邵东县', '3', '0739', '111.74427,27.258987', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1843', '1838', '430522', '新邵县', '3', '0739', '111.458656,27.320917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1844', '1838', '430523', '邵阳县', '3', '0739', '111.273805,26.990637', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1845', '1838', '430524', '隆回县', '3', '0739', '111.032437,27.113978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1846', '1838', '430525', '洞口县', '3', '0739', '110.575846,27.06032', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1847', '1838', '430527', '绥宁县', '3', '0739', '110.155655,26.581954', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1848', '1838', '430528', '新宁县', '3', '0739', '110.856988,26.433367', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1849', '1838', '430529', '城步苗族自治县', '3', '0739', '110.322239,26.390598', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1850', '1838', '430581', '武冈市', '3', '0739', '110.631884,26.726599', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1851', '1798', '430600', '岳阳市', '2', '0730', '113.12873,29.356803', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1852', '1851', '430602', '岳阳楼区', '3', '0730', '113.129684,29.371814', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1853', '1851', '430603', '云溪区', '3', '0730', '113.272312,29.472745', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1854', '1851', '430611', '君山区', '3', '0730', '113.006435,29.461106', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1855', '1851', '430621', '岳阳县', '3', '0730', '113.116418,29.144066', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1856', '1851', '430623', '华容县', '3', '0730', '112.540463,29.531057', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1857', '1851', '430624', '湘阴县', '3', '0730', '112.909426,28.689104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1858', '1851', '430626', '平江县', '3', '0730', '113.581234,28.701868', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1859', '1851', '430681', '汨罗市', '3', '0730', '113.067251,28.806881', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1860', '1851', '430682', '临湘市', '3', '0730', '113.450423,29.476849', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1861', '1798', '430700', '常德市', '2', '0736', '111.698784,29.031654', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1862', '1861', '430702', '武陵区', '3', '0736', '111.683153,29.055163', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1863', '1861', '430703', '鼎城区', '3', '0736', '111.680783,29.018593', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1864', '1861', '430721', '安乡县', '3', '0736', '112.171131,29.411309', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1865', '1861', '430722', '汉寿县', '3', '0736', '111.970514,28.906106', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1866', '1861', '430723', '澧县', '3', '0736', '111.758702,29.633236', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1867', '1861', '430724', '临澧县', '3', '0736', '111.647517,29.440793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1868', '1861', '430725', '桃源县', '3', '0736', '111.488925,28.902503', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1869', '1861', '430726', '石门县', '3', '0736', '111.380014,29.584292', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1870', '1861', '430781', '津市市', '3', '0736', '111.877499,29.60548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1871', '1798', '430800', '张家界市', '2', '0744', '110.479148,29.117013', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1872', '1871', '430802', '永定区', '3', '0744', '110.537138,29.119855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1873', '1871', '430811', '武陵源区', '3', '0744', '110.550433,29.34573', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1874', '1871', '430821', '慈利县', '3', '0744', '111.139775,29.429999', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1875', '1871', '430822', '桑植县', '3', '0744', '110.204652,29.414111', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1876', '1798', '430900', '益阳市', '2', '0737', '112.355129,28.554349', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1877', '1876', '430902', '资阳区', '3', '0737', '112.324272,28.59111', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1878', '1876', '430903', '赫山区', '3', '0737', '112.374145,28.579494', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1879', '1876', '430921', '南县', '3', '0737', '112.396337,29.362275', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1880', '1876', '430922', '桃江县', '3', '0737', '112.155822,28.518084', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1881', '1876', '430923', '安化县', '3', '0737', '111.212846,28.374107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1882', '1876', '430981', '沅江市', '3', '0737', '112.355954,28.847045', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1883', '1798', '431000', '郴州市', '2', '0735', '113.014984,25.770532', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1884', '1883', '431002', '北湖区', '3', '0735', '113.011035,25.784054', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1885', '1883', '431003', '苏仙区', '3', '0735', '113.112105,25.797013', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1886', '1883', '431021', '桂阳县', '3', '0735', '112.734173,25.754172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1887', '1883', '431022', '宜章县', '3', '0735', '112.948712,25.399938', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1888', '1883', '431023', '永兴县', '3', '0735', '113.116527,26.12715', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1889', '1883', '431024', '嘉禾县', '3', '0735', '112.36902,25.587519', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1890', '1883', '431025', '临武县', '3', '0735', '112.563456,25.27556', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1891', '1883', '431026', '汝城县', '3', '0735', '113.684727,25.532816', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1892', '1883', '431027', '桂东县', '3', '0735', '113.944614,26.077616', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1893', '1883', '431028', '安仁县', '3', '0735', '113.26932,26.709061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1894', '1883', '431081', '资兴市', '3', '0735', '113.236146,25.976243', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1895', '1798', '431100', '永州市', '2', '0746', '111.613418,26.419641', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1896', '1895', '431102', '零陵区', '3', '0746', '111.631109,26.221936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1897', '1895', '431103', '冷水滩区', '3', '0746', '111.592343,26.46128', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1898', '1895', '431121', '祁阳县', '3', '0746', '111.840657,26.58012', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1899', '1895', '431122', '东安县', '3', '0746', '111.316464,26.392183', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1900', '1895', '431123', '双牌县', '3', '0746', '111.659967,25.961909', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1901', '1895', '431124', '道县', '3', '0746', '111.600795,25.526437', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1902', '1895', '431125', '江永县', '3', '0746', '111.343911,25.273539', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1903', '1895', '431126', '宁远县', '3', '0746', '111.945844,25.570888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1904', '1895', '431127', '蓝山县', '3', '0746', '112.196567,25.369725', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1905', '1895', '431128', '新田县', '3', '0746', '112.203287,25.904305', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1906', '1895', '431129', '江华瑶族自治县', '3', '0746', '111.579535,25.185809', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1907', '1798', '431200', '怀化市', '2', '0745', '110.001923,27.569517', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1908', '1907', '431202', '鹤城区', '3', '0745', '110.040315,27.578926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1909', '1907', '431221', '中方县', '3', '0745', '109.944711,27.440138', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1910', '1907', '431222', '沅陵县', '3', '0745', '110.393844,28.452686', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1911', '1907', '431223', '辰溪县', '3', '0745', '110.183917,28.006336', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1912', '1907', '431224', '溆浦县', '3', '0745', '110.594879,27.908267', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1913', '1907', '431225', '会同县', '3', '0745', '109.735661,26.887238', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1914', '1907', '431226', '麻阳苗族自治县', '3', '0745', '109.81701,27.857569', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1915', '1907', '431227', '新晃侗族自治县', '3', '0745', '109.174932,27.352673', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1916', '1907', '431228', '芷江侗族自治县', '3', '0745', '109.684629,27.443499', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1917', '1907', '431229', '靖州苗族侗族自治县', '3', '0745', '109.696273,26.575107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1918', '1907', '431230', '通道侗族自治县', '3', '0745', '109.784412,26.158054', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1919', '1907', '431281', '洪江市', '3', '0745', '109.836669,27.208609', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1920', '1798', '431300', '娄底市', '2', '0738', '111.994482,27.70027', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1921', '1920', '431302', '娄星区', '3', '0738', '112.001914,27.729863', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1922', '1920', '431321', '双峰县', '3', '0738', '112.175163,27.457172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1923', '1920', '431322', '新化县', '3', '0738', '111.327412,27.726514', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1924', '1920', '431381', '冷水江市', '3', '0738', '111.434984,27.686251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1925', '1920', '431382', '涟源市', '3', '0738', '111.664329,27.692577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1926', '1798', '433100', '湘西土家族苗族自治州', '2', '0743', '109.738906,28.31195', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1927', '1926', '433101', '吉首市', '3', '0743', '109.698015,28.262376', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1928', '1926', '433122', '泸溪县', '3', '0743', '110.21961,28.216641', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1929', '1926', '433123', '凤凰县', '3', '0743', '109.581083,27.958081', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1930', '1926', '433124', '花垣县', '3', '0743', '109.482078,28.572029', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1931', '1926', '433125', '保靖县', '3', '0743', '109.660559,28.699878', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1932', '1926', '433126', '古丈县', '3', '0743', '109.950728,28.616935', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1933', '1926', '433127', '永顺县', '3', '0743', '109.856933,28.979955', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1934', '1926', '433130', '龙山县', '3', '0743', '109.443938,29.457663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1935', '-1', '440000', '广东省', '1', '[]', '113.26641,23.132324', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1936', '1935', '440100', '广州市', '2', '020', '113.264385,23.12911', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1937', '1936', '440103', '荔湾区', '3', '020', '113.244258,23.125863', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1938', '1936', '440104', '越秀区', '3', '020', '113.266835,23.128537', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1939', '1936', '440105', '海珠区', '3', '020', '113.317443,23.083788', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1940', '1936', '440106', '天河区', '3', '020', '113.361575,23.124807', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1941', '1936', '440111', '白云区', '3', '020', '113.273238,23.157367', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1942', '1936', '440112', '黄埔区', '3', '020', '113.480541,23.181706', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1943', '1936', '440113', '番禺区', '3', '020', '113.384152,22.937556', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1944', '1936', '440114', '花都区', '3', '020', '113.220463,23.403744', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1945', '1936', '440115', '南沙区', '3', '020', '113.525165,22.801624', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1946', '1936', '440117', '从化区', '3', '020', '113.586679,23.548748', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1947', '1936', '440118', '增城区', '3', '020', '113.810627,23.261465', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1948', '1935', '440200', '韶关市', '2', '0751', '113.59762,24.810879', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1949', '1948', '440203', '武江区', '3', '0751', '113.587756,24.792926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1950', '1948', '440204', '浈江区', '3', '0751', '113.611098,24.804381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1951', '1948', '440205', '曲江区', '3', '0751', '113.604535,24.682501', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1952', '1948', '440222', '始兴县', '3', '0751', '114.061789,24.952976', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1953', '1948', '440224', '仁化县', '3', '0751', '113.749027,25.085621', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1954', '1948', '440229', '翁源县', '3', '0751', '114.130342,24.350346', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1955', '1948', '440232', '乳源瑶族自治县', '3', '0751', '113.275883,24.776078', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1956', '1948', '440233', '新丰县', '3', '0751', '114.206867,24.05976', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1957', '1948', '440281', '乐昌市', '3', '0751', '113.347545,25.130602', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1958', '1948', '440282', '南雄市', '3', '0751', '114.311982,25.117753', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1959', '1935', '440300', '深圳市', '2', '0755', '114.057939,22.543527', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1960', '1959', '440303', '罗湖区', '3', '0755', '114.131459,22.548389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1961', '1959', '440304', '福田区', '3', '0755', '114.055072,22.521521', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1962', '1959', '440305', '南山区', '3', '0755', '113.930413,22.533287', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1963', '1959', '440306', '宝安区', '3', '0755', '113.883802,22.554996', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1964', '1959', '440307', '龙岗区', '3', '0755', '114.246899,22.720974', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1965', '1959', '440308', '盐田区', '3', '0755', '114.236739,22.557001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1966', '1959', '440309', '龙华区', '3', '0755', '114.045422,22.696667', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1967', '1959', '440310', '坪山区', '3', '0755', '114.350584,22.708881', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1968', '1935', '440400', '珠海市', '2', '0756', '113.576677,22.270978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1969', '1968', '440402', '香洲区', '3', '0756', '113.543784,22.265811', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1970', '1968', '440403', '斗门区', '3', '0756', '113.296467,22.2092', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1971', '1968', '440404', '金湾区', '3', '0756', '113.362656,22.147471', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1972', '1935', '440500', '汕头市', '2', '0754', '116.681972,23.354091', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1973', '1972', '440507', '龙湖区', '3', '0754', '116.716446,23.372254', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1974', '1972', '440511', '金平区', '3', '0754', '116.70345,23.365556', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1975', '1972', '440512', '濠江区', '3', '0754', '116.726973,23.286079', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1976', '1972', '440513', '潮阳区', '3', '0754', '116.601509,23.265356', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1977', '1972', '440514', '潮南区', '3', '0754', '116.439178,23.23865', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1978', '1972', '440515', '澄海区', '3', '0754', '116.755992,23.466709', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1979', '1972', '440523', '南澳县', '3', '0754', '117.023374,23.421724', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1980', '1935', '440600', '佛山市', '2', '0757', '113.121435,23.021478', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1981', '1980', '440604', '禅城区', '3', '0757', '113.122421,23.009551', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1982', '1980', '440605', '南海区', '3', '0757', '113.143441,23.028956', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1983', '1980', '440606', '顺德区', '3', '0757', '113.293359,22.80524', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1984', '1980', '440607', '三水区', '3', '0757', '112.896685,23.155931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1985', '1980', '440608', '高明区', '3', '0757', '112.892585,22.900139', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1986', '1935', '440700', '江门市', '2', '0750', '113.081542,22.57899', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1987', '1986', '440703', '蓬江区', '3', '0750', '113.078521,22.595149', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1988', '1986', '440704', '江海区', '3', '0750', '113.111612,22.560473', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1989', '1986', '440705', '新会区', '3', '0750', '113.034187,22.4583', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1990', '1986', '440781', '台山市', '3', '0750', '112.794065,22.251924', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1991', '1986', '440783', '开平市', '3', '0750', '112.698545,22.376395', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1992', '1986', '440784', '鹤山市', '3', '0750', '112.964252,22.76545', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1993', '1986', '440785', '恩平市', '3', '0750', '112.305145,22.183206', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1994', '1935', '440800', '湛江市', '2', '0759', '110.356639,21.270145', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1995', '1994', '440802', '赤坎区', '3', '0759', '110.365899,21.266119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1996', '1994', '440803', '霞山区', '3', '0759', '110.397656,21.192457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1997', '1994', '440804', '坡头区', '3', '0759', '110.455332,21.244721', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1998', '1994', '440811', '麻章区', '3', '0759', '110.334387,21.263442', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('1999', '1994', '440823', '遂溪县', '3', '0759', '110.250123,21.377246', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2000', '1994', '440825', '徐闻县', '3', '0759', '110.176749,20.325489', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2001', '1994', '440881', '廉江市', '3', '0759', '110.286208,21.6097', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2002', '1994', '440882', '雷州市', '3', '0759', '110.096586,20.914178', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2003', '1994', '440883', '吴川市', '3', '0759', '110.778411,21.441808', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2004', '1935', '440900', '茂名市', '2', '0668', '110.925439,21.662991', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2005', '2004', '440902', '茂南区', '3', '0668', '110.918026,21.641337', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2006', '2004', '440904', '电白区', '3', '0668', '111.013556,21.514163', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2007', '2004', '440981', '高州市', '3', '0668', '110.853299,21.918203', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2008', '2004', '440982', '化州市', '3', '0668', '110.639565,21.66463', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2009', '2004', '440983', '信宜市', '3', '0668', '110.947043,22.354385', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2010', '1935', '441200', '肇庆市', '2', '0758', '112.465091,23.047191', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2011', '2010', '441202', '端州区', '3', '0758', '112.484848,23.052101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2012', '2010', '441203', '鼎湖区', '3', '0758', '112.567588,23.158447', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2013', '2010', '441204', '高要区', '3', '0758', '112.457981,23.025305', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2014', '2010', '441223', '广宁县', '3', '0758', '112.44069,23.634675', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2015', '2010', '441224', '怀集县', '3', '0758', '112.167742,23.92035', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2016', '2010', '441225', '封开县', '3', '0758', '111.512343,23.424033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2017', '2010', '441226', '德庆县', '3', '0758', '111.785937,23.143722', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2018', '2010', '441284', '四会市', '3', '0758', '112.734103,23.327001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2019', '1935', '441300', '惠州市', '2', '0752', '114.415612,23.112381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2020', '2019', '441302', '惠城区', '3', '0752', '114.382474,23.084137', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2021', '2019', '441303', '惠阳区', '3', '0752', '114.456176,22.789788', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2022', '2019', '441322', '博罗县', '3', '0752', '114.289528,23.172771', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2023', '2019', '441323', '惠东县', '3', '0752', '114.719988,22.985014', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2024', '2019', '441324', '龙门县', '3', '0752', '114.254863,23.727737', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2025', '1935', '441400', '梅州市', '2', '0753', '116.122523,24.288578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2026', '2025', '441402', '梅江区', '3', '0753', '116.116695,24.31049', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2027', '2025', '441403', '梅县区', '3', '0753', '116.081656,24.265926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2028', '2025', '441422', '大埔县', '3', '0753', '116.695195,24.347782', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2029', '2025', '441423', '丰顺县', '3', '0753', '116.181691,23.739343', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2030', '2025', '441424', '五华县', '3', '0753', '115.775788,23.932409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2031', '2025', '441426', '平远县', '3', '0753', '115.891638,24.567261', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2032', '2025', '441427', '蕉岭县', '3', '0753', '116.171355,24.658699', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2033', '2025', '441481', '兴宁市', '3', '0753', '115.731167,24.136708', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2034', '1935', '441500', '汕尾市', '2', '0660', '115.375431,22.78705', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2035', '2034', '441502', '城区', '3', '0660', '115.365058,22.779207', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2036', '2034', '441521', '海丰县', '3', '0660', '115.323436,22.966585', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2037', '2034', '441523', '陆河县', '3', '0660', '115.660143,23.301616', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2038', '2034', '441581', '陆丰市', '3', '0660', '115.652151,22.919228', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2039', '1935', '441600', '河源市', '2', '0762', '114.700961,23.743686', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2040', '2039', '441602', '源城区', '3', '0762', '114.702517,23.733969', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2041', '2039', '441621', '紫金县', '3', '0762', '115.184107,23.635745', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2042', '2039', '441622', '龙川县', '3', '0762', '115.259871,24.100066', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2043', '2039', '441623', '连平县', '3', '0762', '114.488556,24.369583', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2044', '2039', '441624', '和平县', '3', '0762', '114.938684,24.44218', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2045', '2039', '441625', '东源县', '3', '0762', '114.746344,23.788189', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2046', '1935', '441700', '阳江市', '2', '0662', '111.982589,21.857887', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2047', '2046', '441702', '江城区', '3', '0662', '111.955058,21.861786', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2048', '2046', '441704', '阳东区', '3', '0662', '112.006363,21.868337', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2049', '2046', '441721', '阳西县', '3', '0662', '111.61766,21.752771', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2050', '2046', '441781', '阳春市', '3', '0662', '111.791587,22.17041', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2051', '1935', '441800', '清远市', '2', '0763', '113.056042,23.681774', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2052', '2051', '441802', '清城区', '3', '0763', '113.062692,23.697899', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2053', '2051', '441803', '清新区', '3', '0763', '113.017747,23.734677', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2054', '2051', '441821', '佛冈县', '3', '0763', '113.531607,23.879192', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2055', '2051', '441823', '阳山县', '3', '0763', '112.641363,24.465359', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2056', '2051', '441825', '连山壮族瑶族自治县', '3', '0763', '112.093617,24.570491', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2057', '2051', '441826', '连南瑶族自治县', '3', '0763', '112.287012,24.726017', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2058', '2051', '441881', '英德市', '3', '0763', '113.401701,24.206986', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2059', '2051', '441882', '连州市', '3', '0763', '112.377361,24.780966', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2060', '1935', '441900', '东莞市', '2', '0769', '113.751799,23.020673', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2061', '1935', '442000', '中山市', '2', '0760', '113.39277,22.517585', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2062', '1935', '445100', '潮州市', '2', '0768', '116.622444,23.657262', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2063', '2062', '445102', '湘桥区', '3', '0768', '116.628627,23.674387', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2064', '2062', '445103', '潮安区', '3', '0768', '116.678203,23.462613', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2065', '2062', '445122', '饶平县', '3', '0768', '117.0039,23.663824', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2066', '1935', '445200', '揭阳市', '2', '0663', '116.372708,23.549701', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2067', '2066', '445202', '榕城区', '3', '0663', '116.367012,23.525382', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2068', '2066', '445203', '揭东区', '3', '0663', '116.412015,23.566126', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2069', '2066', '445222', '揭西县', '3', '0663', '115.841837,23.431294', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2070', '2066', '445224', '惠来县', '3', '0663', '116.29515,23.033266', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2071', '2066', '445281', '普宁市', '3', '0663', '116.165777,23.297493', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2072', '1935', '445300', '云浮市', '2', '0766', '112.044491,22.915094', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2073', '2072', '445302', '云城区', '3', '0766', '112.043945,22.92815', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2074', '2072', '445303', '云安区', '3', '0766', '112.003208,23.071019', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2075', '2072', '445321', '新兴县', '3', '0766', '112.225334,22.69569', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2076', '2072', '445322', '郁南县', '3', '0766', '111.535285,23.23456', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2077', '2072', '445381', '罗定市', '3', '0766', '111.569892,22.768285', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2078', '1935', '442100', '东沙群岛', '2', '[]', '116.887613,20.617825', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2079', '-1', '450000', '广西壮族自治区', '1', '[]', '108.327546,22.815478', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2080', '2079', '450100', '南宁市', '2', '0771', '108.366543,22.817002', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2081', '2080', '450102', '兴宁区', '3', '0771', '108.368871,22.854021', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2082', '2080', '450103', '青秀区', '3', '0771', '108.494024,22.785879', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2083', '2080', '450105', '江南区', '3', '0771', '108.273133,22.78136', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2084', '2080', '450107', '西乡塘区', '3', '0771', '108.313494,22.833928', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2085', '2080', '450108', '良庆区', '3', '0771', '108.39301,22.752997', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2086', '2080', '450109', '邕宁区', '3', '0771', '108.487368,22.75839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2087', '2080', '450110', '武鸣区', '3', '0771', '108.27467,23.158595', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2088', '2080', '450123', '隆安县', '3', '0771', '107.696153,23.166028', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2089', '2080', '450124', '马山县', '3', '0771', '108.177019,23.708321', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2090', '2080', '450125', '上林县', '3', '0771', '108.602846,23.431908', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2091', '2080', '450126', '宾阳县', '3', '0771', '108.810326,23.217786', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2092', '2080', '450127', '横县', '3', '0771', '109.261384,22.679931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2093', '2079', '450200', '柳州市', '2', '0772', '109.428608,24.326291', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2094', '2093', '450202', '城中区', '3', '0772', '109.4273,24.366', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2095', '2093', '450203', '鱼峰区', '3', '0772', '109.452442,24.318516', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2096', '2093', '450204', '柳南区', '3', '0772', '109.385518,24.336229', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2097', '2093', '450205', '柳北区', '3', '0772', '109.402049,24.362691', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2098', '2093', '450206', '柳江区', '3', '0772', '109.32638,24.254891', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2099', '2093', '450222', '柳城县', '3', '0772', '109.24473,24.651518', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2100', '2093', '450223', '鹿寨县', '3', '0772', '109.750638,24.472897', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2101', '2093', '450224', '融安县', '3', '0772', '109.397538,25.224549', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2102', '2093', '450225', '融水苗族自治县', '3', '0772', '109.256334,25.065934', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2103', '2093', '450226', '三江侗族自治县', '3', '0772', '109.607675,25.783198', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2104', '2079', '450300', '桂林市', '2', '0773', '110.179953,25.234479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2105', '2104', '450302', '秀峰区', '3', '0773', '110.264183,25.273625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2106', '2104', '450303', '叠彩区', '3', '0773', '110.301723,25.314', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2107', '2104', '450304', '象山区', '3', '0773', '110.281082,25.261686', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2108', '2104', '450305', '七星区', '3', '0773', '110.317826,25.252701', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2109', '2104', '450311', '雁山区', '3', '0773', '110.28669,25.101934', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2110', '2104', '450312', '临桂区', '3', '0773', '110.212463,25.238628', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2111', '2104', '450321', '阳朔县', '3', '0773', '110.496593,24.77848', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2112', '2104', '450323', '灵川县', '3', '0773', '110.319897,25.394781', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2113', '2104', '450324', '全州县', '3', '0773', '111.072946,25.928387', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2114', '2104', '450325', '兴安县', '3', '0773', '110.67167,25.611704', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2115', '2104', '450326', '永福县', '3', '0773', '109.983076,24.979855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2116', '2104', '450327', '灌阳县', '3', '0773', '111.160851,25.489383', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2117', '2104', '450328', '龙胜各族自治县', '3', '0773', '110.011238,25.797931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2118', '2104', '450329', '资源县', '3', '0773', '110.6527,26.042443', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2119', '2104', '450330', '平乐县', '3', '0773', '110.643305,24.633362', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2120', '2104', '450331', '荔浦县', '3', '0773', '110.395104,24.488342', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2121', '2104', '450332', '恭城瑶族自治县', '3', '0773', '110.828409,24.831682', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2122', '2079', '450400', '梧州市', '2', '0774', '111.279115,23.476962', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2123', '2122', '450403', '万秀区', '3', '0774', '111.320518,23.472991', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2124', '2122', '450405', '长洲区', '3', '0774', '111.274673,23.485944', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2125', '2122', '450406', '龙圩区', '3', '0774', '111.246606,23.404772', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2126', '2122', '450421', '苍梧县', '3', '0774', '111.544007,23.845097', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2127', '2122', '450422', '藤县', '3', '0774', '110.914849,23.374983', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2128', '2122', '450423', '蒙山县', '3', '0774', '110.525003,24.19357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2129', '2122', '450481', '岑溪市', '3', '0774', '110.994913,22.91835', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2130', '2079', '450500', '北海市', '2', '0779', '109.120161,21.481291', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2131', '2130', '450502', '海城区', '3', '0779', '109.117209,21.475004', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2132', '2130', '450503', '银海区', '3', '0779', '109.139862,21.449308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2133', '2130', '450512', '铁山港区', '3', '0779', '109.42158,21.529127', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2134', '2130', '450521', '合浦县', '3', '0779', '109.207335,21.660935', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2135', '2079', '450600', '防城港市', '2', '0770', '108.353846,21.68686', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2136', '2135', '450602', '港口区', '3', '0770', '108.380143,21.643383', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2137', '2135', '450603', '防城区', '3', '0770', '108.353499,21.769211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2138', '2135', '450621', '上思县', '3', '0770', '107.983627,22.153671', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2139', '2135', '450681', '东兴市', '3', '0770', '107.971828,21.547821', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2140', '2079', '450700', '钦州市', '2', '0777', '108.654146,21.979933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2141', '2140', '450702', '钦南区', '3', '0777', '108.657209,21.938859', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2142', '2140', '450703', '钦北区', '3', '0777', '108.44911,22.132761', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2143', '2140', '450721', '灵山县', '3', '0777', '109.291006,22.416536', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2144', '2140', '450722', '浦北县', '3', '0777', '109.556953,22.271651', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2145', '2079', '450800', '贵港市', '2', '1755', '109.598926,23.11153', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2146', '2145', '450802', '港北区', '3', '1755', '109.57224,23.11153', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2147', '2145', '450803', '港南区', '3', '1755', '109.599556,23.075573', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2148', '2145', '450804', '覃塘区', '3', '1755', '109.452662,23.127149', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2149', '2145', '450821', '平南县', '3', '1755', '110.392311,23.539264', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2150', '2145', '450881', '桂平市', '3', '1755', '110.079379,23.394325', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2151', '2079', '450900', '玉林市', '2', '0775', '110.18122,22.654032', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2152', '2151', '450902', '玉州区', '3', '0775', '110.151153,22.628087', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2153', '2151', '450903', '福绵区', '3', '0775', '110.059439,22.585556', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2154', '2151', '450921', '容县', '3', '0775', '110.558074,22.857839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2155', '2151', '450922', '陆川县', '3', '0775', '110.264052,22.321048', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2156', '2151', '450923', '博白县', '3', '0775', '109.975985,22.273048', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2157', '2151', '450924', '兴业县', '3', '0775', '109.875304,22.736421', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2158', '2151', '450981', '北流市', '3', '0775', '110.354214,22.70831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2159', '2079', '451000', '百色市', '2', '0776', '106.618202,23.90233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2160', '2159', '451002', '右江区', '3', '0776', '106.618225,23.90097', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2161', '2159', '451021', '田阳县', '3', '0776', '106.915496,23.735692', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2162', '2159', '451022', '田东县', '3', '0776', '107.12608,23.597194', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2163', '2159', '451023', '平果县', '3', '0776', '107.589809,23.329376', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2164', '2159', '451024', '德保县', '3', '0776', '106.615373,23.32345', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2165', '2159', '451026', '那坡县', '3', '0776', '105.83253,23.387441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2166', '2159', '451027', '凌云县', '3', '0776', '106.56131,24.347557', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2167', '2159', '451028', '乐业县', '3', '0776', '106.556519,24.776827', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2168', '2159', '451029', '田林县', '3', '0776', '106.228538,24.294487', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2169', '2159', '451030', '西林县', '3', '0776', '105.093825,24.489823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2170', '2159', '451031', '隆林各族自治县', '3', '0776', '105.34404,24.770896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2171', '2159', '451081', '靖西市', '3', '0776', '106.417805,23.134117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2172', '2079', '451100', '贺州市', '2', '1774', '111.566871,24.403528', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2173', '2172', '451102', '八步区', '3', '1774', '111.552095,24.411805', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2174', '2172', '451103', '平桂区', '3', '1774', '111.479923,24.453845', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2175', '2172', '451121', '昭平县', '3', '1774', '110.811325,24.169385', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2176', '2172', '451122', '钟山县', '3', '1774', '111.303009,24.525957', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2177', '2172', '451123', '富川瑶族自治县', '3', '1774', '111.27745,24.814443', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2178', '2079', '451200', '河池市', '2', '0778', '108.085261,24.692931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2179', '2178', '451202', '金城江区', '3', '0778', '108.037276,24.689703', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2180', '2178', '451221', '南丹县', '3', '0778', '107.541244,24.975631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2181', '2178', '451222', '天峨县', '3', '0778', '107.173802,24.999108', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2182', '2178', '451223', '凤山县', '3', '0778', '107.04219,24.546876', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2183', '2178', '451224', '东兰县', '3', '0778', '107.374293,24.510842', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2184', '2178', '451225', '罗城仫佬族自治县', '3', '0778', '108.904706,24.777411', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2185', '2178', '451226', '环江毛南族自治县', '3', '0778', '108.258028,24.825664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2186', '2178', '451227', '巴马瑶族自治县', '3', '0778', '107.258588,24.142298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2187', '2178', '451228', '都安瑶族自治县', '3', '0778', '108.105311,23.932675', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2188', '2178', '451229', '大化瑶族自治县', '3', '0778', '107.998149,23.736457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2189', '2178', '451203', '宜州区', '3', '0778', '108.636414,24.485214', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2190', '2079', '451300', '来宾市', '2', '1772', '109.221465,23.750306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2191', '2190', '451302', '兴宾区', '3', '1772', '109.183333,23.72892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2192', '2190', '451321', '忻城县', '3', '1772', '108.665666,24.066234', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2193', '2190', '451322', '象州县', '3', '1772', '109.705065,23.973793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2194', '2190', '451323', '武宣县', '3', '1772', '109.663206,23.59411', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2195', '2190', '451324', '金秀瑶族自治县', '3', '1772', '110.189462,24.130374', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2196', '2190', '451381', '合山市', '3', '1772', '108.886082,23.806535', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2197', '2079', '451400', '崇左市', '2', '1771', '107.365094,22.377253', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2198', '2197', '451402', '江州区', '3', '1771', '107.353437,22.405325', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2199', '2197', '451421', '扶绥县', '3', '1771', '107.904186,22.635012', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2200', '2197', '451422', '宁明县', '3', '1771', '107.076456,22.140192', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2201', '2197', '451423', '龙州县', '3', '1771', '106.854482,22.342778', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2202', '2197', '451424', '大新县', '3', '1771', '107.200654,22.829287', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2203', '2197', '451425', '天等县', '3', '1771', '107.143432,23.081394', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2204', '2197', '451481', '凭祥市', '3', '1771', '106.766293,22.094484', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2205', '-1', '460000', '海南省', '1', '[]', '110.349228,20.017377', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2206', '2205', '469025', '白沙黎族自治县', '2', '0802', '109.451484,19.224823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2207', '2205', '469029', '保亭黎族苗族自治县', '2', '0801', '109.70259,18.63913', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2208', '2205', '469026', '昌江黎族自治县', '2', '0803', '109.055739,19.298184', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2209', '2205', '469023', '澄迈县', '2', '0804', '110.006754,19.738521', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2210', '2205', '460100', '海口市', '2', '0898', '110.198286,20.044412', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2211', '2210', '460105', '秀英区', '3', '0898', '110.293603,20.007494', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2212', '2210', '460106', '龙华区', '3', '0898', '110.328492,20.031006', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2213', '2210', '460107', '琼山区', '3', '0898', '110.353972,20.003169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2214', '2210', '460108', '美兰区', '3', '0898', '110.366358,20.029083', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2215', '2205', '460200', '三亚市', '2', '0899', '109.511772,18.253135', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2216', '2215', '460202', '海棠区', '3', '0899', '109.752569,18.400106', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2217', '2215', '460203', '吉阳区', '3', '0899', '109.578336,18.281406', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2218', '2215', '460204', '天涯区', '3', '0899', '109.452378,18.298156', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2219', '2215', '460205', '崖州区', '3', '0899', '109.171841,18.357291', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2220', '2205', '460300', '三沙市', '2', '2898', '112.338695,16.831839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2221', '2220', '460321', '西沙群岛', '3', '1895', '111.792944,16.204546', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2222', '2220', '460322', '南沙群岛', '3', '1891', '116.749997,11.471888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2223', '2220', '460323', '中沙群岛的岛礁及其海域', '3', '2801', '117.740071,15.112855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2224', '2205', '460400', '儋州市', '2', '0805', '109.580811,19.521134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2225', '2205', '469021', '定安县', '2', '0806', '110.359339,19.681404', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2226', '2205', '469007', '东方市', '2', '0807', '108.651815,19.095351', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2227', '2205', '469027', '乐东黎族自治县', '2', '2802', '109.173054,18.750259', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2228', '2205', '469024', '临高县', '2', '1896', '109.690508,19.912025', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2229', '2205', '469028', '陵水黎族自治县', '2', '0809', '110.037503,18.506048', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2230', '2205', '469002', '琼海市', '2', '1894', '110.474497,19.259134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2231', '2205', '469030', '琼中黎族苗族自治县', '2', '1899', '109.838389,19.033369', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2232', '2205', '469022', '屯昌县', '2', '1892', '110.103415,19.351765', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2233', '2205', '469006', '万宁市', '2', '1898', '110.391073,18.795143', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2234', '2205', '469005', '文昌市', '2', '1893', '110.797717,19.543422', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2235', '2205', '469001', '五指山市', '2', '1897', '109.516925,18.775146', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2236', '-1', '500000', '重庆市', '1', '023', '106.551643,29.562849', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2237', '2236', '500100', '重庆城区', '2', '023', '106.551643,29.562849', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2238', '2237', '500101', '万州区', '3', '023', '108.408661,30.807667', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2239', '2237', '500102', '涪陵区', '3', '023', '107.38977,29.703022', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2240', '2237', '500103', '渝中区', '3', '023', '106.568896,29.552736', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2241', '2237', '500104', '大渡口区', '3', '023', '106.482346,29.484527', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2242', '2237', '500105', '江北区', '3', '023', '106.574271,29.606703', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2243', '2237', '500106', '沙坪坝区', '3', '023', '106.456878,29.541144', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2244', '2237', '500107', '九龙坡区', '3', '023', '106.510676,29.502272', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2245', '2237', '500108', '南岸区', '3', '023', '106.644447,29.50126', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2246', '2237', '500109', '北碚区', '3', '023', '106.395612,29.805107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2247', '2237', '500110', '綦江区', '3', '023', '106.651361,29.028066', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2248', '2237', '500111', '大足区', '3', '023', '105.721733,29.707032', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2249', '2237', '500112', '渝北区', '3', '023', '106.631187,29.718142', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2250', '2237', '500113', '巴南区', '3', '023', '106.540256,29.402408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2251', '2237', '500114', '黔江区', '3', '023', '108.770677,29.533609', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2252', '2237', '500115', '长寿区', '3', '023', '107.080734,29.857912', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2253', '2237', '500116', '江津区', '3', '023', '106.259281,29.290069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2254', '2237', '500117', '合川区', '3', '023', '106.27613,29.972084', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2255', '2237', '500118', '永川区', '3', '023', '105.927001,29.356311', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2256', '2237', '500119', '南川区', '3', '023', '107.099266,29.15789', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2257', '2237', '500120', '璧山区', '3', '023', '106.227305,29.592024', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2258', '2237', '500151', '铜梁区', '3', '023', '106.056404,29.844811', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2259', '2237', '500152', '潼南区', '3', '023', '105.840431,30.190992', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2260', '2237', '500153', '荣昌区', '3', '023', '105.594623,29.405002', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2261', '2237', '500154', '开州区', '3', '023', '108.393135,31.160711', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2262', '2236', '500200', '重庆郊县', '2', '023', '108.165537,29.293902', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2263', '2262', '500155', '梁平区', '3', '023', '107.769568,30.654233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2264', '2262', '500229', '城口县', '3', '023', '108.664214,31.947633', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2265', '2262', '500230', '丰都县', '3', '023', '107.730894,29.8635', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2266', '2262', '500231', '垫江县', '3', '023', '107.33339,30.327716', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2267', '2262', '500156', '武隆区', '3', '023', '107.760025,29.325601', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2268', '2262', '500233', '忠县', '3', '023', '108.039002,30.299559', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2269', '2262', '500235', '云阳县', '3', '023', '108.697324,30.930612', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2270', '2262', '500236', '奉节县', '3', '023', '109.400403,31.018363', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2271', '2262', '500237', '巫山县', '3', '023', '109.879153,31.074834', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2272', '2262', '500238', '巫溪县', '3', '023', '109.570062,31.398604', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2273', '2262', '500240', '石柱土家族自治县', '3', '023', '108.114069,29.999285', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2274', '2262', '500241', '秀山土家族苗族自治县', '3', '023', '109.007094,28.447997', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2275', '2262', '500242', '酉阳土家族苗族自治县', '3', '023', '108.767747,28.841244', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2276', '2262', '500243', '彭水苗族土家族自治县', '3', '023', '108.165537,29.293902', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2277', '-1', '510000', '四川省', '1', '[]', '104.075809,30.651239', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2278', '2277', '510100', '成都市', '2', '028', '104.066794,30.572893', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2279', '2278', '510104', '锦江区', '3', '028', '104.117022,30.598158', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2280', '2278', '510105', '青羊区', '3', '028', '104.061442,30.673914', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2281', '2278', '510106', '金牛区', '3', '028', '104.052236,30.691359', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2282', '2278', '510107', '武侯区', '3', '028', '104.043235,30.641907', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2283', '2278', '510108', '成华区', '3', '028', '104.101515,30.659966', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2284', '2278', '510112', '龙泉驿区', '3', '028', '104.274632,30.556506', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2285', '2278', '510113', '青白江区', '3', '028', '104.250945,30.878629', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2286', '2278', '510114', '新都区', '3', '028', '104.158705,30.823498', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2287', '2278', '510115', '温江区', '3', '028', '103.856646,30.682203', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2288', '2278', '510116', '双流区', '3', '028', '103.923566,30.574449', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2289', '2278', '510121', '金堂县', '3', '028', '104.411976,30.861979', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2290', '2278', '510117', '郫都区', '3', '028', '103.901091,30.795854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2291', '2278', '510129', '大邑县', '3', '028', '103.511865,30.572268', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2292', '2278', '510131', '蒲江县', '3', '028', '103.506498,30.196788', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2293', '2278', '510132', '新津县', '3', '028', '103.811286,30.410346', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2294', '2278', '510185', '简阳市', '3', '028', '104.54722,30.411264', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2295', '2278', '510181', '都江堰市', '3', '028', '103.647153,30.988767', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2296', '2278', '510182', '彭州市', '3', '028', '103.957983,30.990212', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2297', '2278', '510183', '邛崃市', '3', '028', '103.464207,30.410324', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2298', '2278', '510184', '崇州市', '3', '028', '103.673001,30.630122', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2299', '2277', '510300', '自贡市', '2', '0813', '104.778442,29.33903', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2300', '2299', '510302', '自流井区', '3', '0813', '104.777191,29.337429', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2301', '2299', '510303', '贡井区', '3', '0813', '104.715288,29.345313', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2302', '2299', '510304', '大安区', '3', '0813', '104.773994,29.363702', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2303', '2299', '510311', '沿滩区', '3', '0813', '104.874079,29.272586', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2304', '2299', '510321', '荣县', '3', '0813', '104.417493,29.445479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2305', '2299', '510322', '富顺县', '3', '0813', '104.975048,29.181429', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2306', '2277', '510400', '攀枝花市', '2', '0812', '101.718637,26.582347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2307', '2306', '510402', '东区', '3', '0812', '101.704109,26.546491', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2308', '2306', '510403', '西区', '3', '0812', '101.630619,26.597781', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2309', '2306', '510411', '仁和区', '3', '0812', '101.738528,26.497765', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2310', '2306', '510421', '米易县', '3', '0812', '102.112895,26.897694', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2311', '2306', '510422', '盐边县', '3', '0812', '101.855071,26.683213', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2312', '2277', '510500', '泸州市', '2', '0830', '105.442285,28.871805', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2313', '2312', '510502', '江阳区', '3', '0830', '105.434982,28.87881', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2314', '2312', '510503', '纳溪区', '3', '0830', '105.371505,28.773134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2315', '2312', '510504', '龙马潭区', '3', '0830', '105.437751,28.913257', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2316', '2312', '510521', '泸县', '3', '0830', '105.381893,29.151534', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2317', '2312', '510522', '合江县', '3', '0830', '105.830986,28.811164', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2318', '2312', '510524', '叙永县', '3', '0830', '105.444765,28.155801', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2319', '2312', '510525', '古蔺县', '3', '0830', '105.812601,28.038801', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2320', '2277', '510600', '德阳市', '2', '0838', '104.397894,31.126855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2321', '2320', '510603', '旌阳区', '3', '0838', '104.416966,31.142633', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2322', '2320', '510623', '中江县', '3', '0838', '104.678751,31.03307', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2323', '2320', '510626', '罗江县', '3', '0838', '104.510249,31.317045', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2324', '2320', '510681', '广汉市', '3', '0838', '104.282429,30.977119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2325', '2320', '510682', '什邡市', '3', '0838', '104.167501,31.12678', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2326', '2320', '510683', '绵竹市', '3', '0838', '104.22075,31.338077', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2327', '2277', '510700', '绵阳市', '2', '0816', '104.679004,31.467459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2328', '2327', '510703', '涪城区', '3', '0816', '104.756944,31.455101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2329', '2327', '510704', '游仙区', '3', '0816', '104.766392,31.473779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2330', '2327', '510705', '安州区', '3', '0816', '104.567187,31.534886', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2331', '2327', '510722', '三台县', '3', '0816', '105.094586,31.095979', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2332', '2327', '510723', '盐亭县', '3', '0816', '105.389453,31.208362', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2333', '2327', '510725', '梓潼县', '3', '0816', '105.170845,31.642718', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2334', '2327', '510726', '北川羌族自治县', '3', '0816', '104.46797,31.617203', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2335', '2327', '510727', '平武县', '3', '0816', '104.555583,32.409675', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2336', '2327', '510781', '江油市', '3', '0816', '104.745915,31.778026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2337', '2277', '510800', '广元市', '2', '0839', '105.843357,32.435435', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2338', '2337', '510802', '利州区', '3', '0839', '105.845307,32.433756', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2339', '2337', '510811', '昭化区', '3', '0839', '105.962819,32.323256', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2340', '2337', '510812', '朝天区', '3', '0839', '105.882642,32.651336', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2341', '2337', '510821', '旺苍县', '3', '0839', '106.289983,32.229058', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2342', '2337', '510822', '青川县', '3', '0839', '105.238842,32.575484', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2343', '2337', '510823', '剑阁县', '3', '0839', '105.524766,32.287722', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2344', '2337', '510824', '苍溪县', '3', '0839', '105.934756,31.731709', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2345', '2277', '510900', '遂宁市', '2', '0825', '105.592803,30.53292', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2346', '2345', '510903', '船山区', '3', '0825', '105.568297,30.525475', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2347', '2345', '510904', '安居区', '3', '0825', '105.456342,30.355379', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2348', '2345', '510921', '蓬溪县', '3', '0825', '105.70757,30.757575', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2349', '2345', '510922', '射洪县', '3', '0825', '105.388412,30.871131', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2350', '2345', '510923', '大英县', '3', '0825', '105.236923,30.594409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2351', '2277', '511000', '内江市', '2', '1832', '105.058432,29.580228', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2352', '2351', '511002', '市中区', '3', '1832', '105.067597,29.587053', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2353', '2351', '511011', '东兴区', '3', '1832', '105.075489,29.592756', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2354', '2351', '511024', '威远县', '3', '1832', '104.668879,29.52744', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2355', '2351', '511025', '资中县', '3', '1832', '104.851944,29.764059', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2356', '2351', '511028', '隆昌市', '3', '1832', '105.287612,29.339476', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2357', '2277', '511100', '乐山市', '2', '0833', '103.765678,29.552115', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2358', '2357', '511102', '市中区', '3', '0833', '103.761329,29.555374', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2359', '2357', '511111', '沙湾区', '3', '0833', '103.549991,29.413091', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2360', '2357', '511112', '五通桥区', '3', '0833', '103.818014,29.406945', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2361', '2357', '511113', '金口河区', '3', '0833', '103.07862,29.244345', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2362', '2357', '511123', '犍为县', '3', '0833', '103.949326,29.20817', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2363', '2357', '511124', '井研县', '3', '0833', '104.069726,29.651287', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2364', '2357', '511126', '夹江县', '3', '0833', '103.571656,29.73763', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2365', '2357', '511129', '沐川县', '3', '0833', '103.902334,28.956647', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2366', '2357', '511132', '峨边彝族自治县', '3', '0833', '103.262048,29.230425', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2367', '2357', '511133', '马边彝族自治县', '3', '0833', '103.546347,28.83552', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2368', '2357', '511181', '峨眉山市', '3', '0833', '103.484503,29.601198', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2369', '2277', '511300', '南充市', '2', '0817', '106.110698,30.837793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2370', '2369', '511302', '顺庆区', '3', '0817', '106.09245,30.796803', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2371', '2369', '511303', '高坪区', '3', '0817', '106.118808,30.781623', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2372', '2369', '511304', '嘉陵区', '3', '0817', '106.071876,30.758823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2373', '2369', '511321', '南部县', '3', '0817', '106.036584,31.347467', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2374', '2369', '511322', '营山县', '3', '0817', '106.565519,31.076579', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2375', '2369', '511323', '蓬安县', '3', '0817', '106.412136,31.029091', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2376', '2369', '511324', '仪陇县', '3', '0817', '106.303042,31.271561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2377', '2369', '511325', '西充县', '3', '0817', '105.90087,30.995683', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2378', '2369', '511381', '阆中市', '3', '0817', '106.005046,31.558356', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2379', '2277', '511400', '眉山市', '2', '1833', '103.848403,30.076994', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2380', '2379', '511402', '东坡区', '3', '1833', '103.831863,30.042308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2381', '2379', '511403', '彭山区', '3', '1833', '103.872949,30.193056', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2382', '2379', '511421', '仁寿县', '3', '1833', '104.133995,29.995635', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2383', '2379', '511423', '洪雅县', '3', '1833', '103.372863,29.90489', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2384', '2379', '511424', '丹棱县', '3', '1833', '103.512783,30.01521', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2385', '2379', '511425', '青神县', '3', '1833', '103.846688,29.831357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2386', '2277', '511500', '宜宾市', '2', '0831', '104.642845,28.752134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2387', '2386', '511502', '翠屏区', '3', '0831', '104.620009,28.765689', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2388', '2386', '511503', '南溪区', '3', '0831', '104.969152,28.846382', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2389', '2386', '511521', '宜宾县', '3', '0831', '104.533212,28.690045', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2390', '2386', '511523', '江安县', '3', '0831', '105.066879,28.723855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2391', '2386', '511524', '长宁县', '3', '0831', '104.921174,28.582169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2392', '2386', '511525', '高县', '3', '0831', '104.517748,28.436166', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2393', '2386', '511526', '珙县', '3', '0831', '104.709202,28.43863', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2394', '2386', '511527', '筠连县', '3', '0831', '104.512025,28.167831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2395', '2386', '511528', '兴文县', '3', '0831', '105.236325,28.303614', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2396', '2386', '511529', '屏山县', '3', '0831', '104.345974,28.828482', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2397', '2277', '511600', '广安市', '2', '0826', '106.633088,30.456224', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2398', '2397', '511602', '广安区', '3', '0826', '106.641662,30.473913', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2399', '2397', '511603', '前锋区', '3', '0826', '106.886143,30.495804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2400', '2397', '511621', '岳池县', '3', '0826', '106.440114,30.537863', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2401', '2397', '511622', '武胜县', '3', '0826', '106.295764,30.348772', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2402', '2397', '511623', '邻水县', '3', '0826', '106.93038,30.334768', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2403', '2397', '511681', '华蓥市', '3', '0826', '106.7831,30.390188', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2404', '2277', '511700', '达州市', '2', '0818', '107.467758,31.209121', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2405', '2404', '511702', '通川区', '3', '0818', '107.504928,31.214715', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2406', '2404', '511703', '达川区', '3', '0818', '107.511749,31.196157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2407', '2404', '511722', '宣汉县', '3', '0818', '107.72719,31.353835', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2408', '2404', '511723', '开江县', '3', '0818', '107.868736,31.082986', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2409', '2404', '511724', '大竹县', '3', '0818', '107.204795,30.73641', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2410', '2404', '511725', '渠县', '3', '0818', '106.97303,30.836618', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2411', '2404', '511781', '万源市', '3', '0818', '108.034657,32.081631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2412', '2277', '511800', '雅安市', '2', '0835', '103.042375,30.010602', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2413', '2412', '511802', '雨城区', '3', '0835', '103.033026,30.005461', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2414', '2412', '511803', '名山区', '3', '0835', '103.109184,30.069954', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2415', '2412', '511822', '荥经县', '3', '0835', '102.846737,29.792931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2416', '2412', '511823', '汉源县', '3', '0835', '102.645467,29.347192', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2417', '2412', '511824', '石棉县', '3', '0835', '102.359462,29.227874', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2418', '2412', '511825', '天全县', '3', '0835', '102.758317,30.066712', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2419', '2412', '511826', '芦山县', '3', '0835', '102.932385,30.142307', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2420', '2412', '511827', '宝兴县', '3', '0835', '102.815403,30.37641', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2421', '2277', '511900', '巴中市', '2', '0827', '106.747477,31.867903', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2422', '2421', '511902', '巴州区', '3', '0827', '106.768878,31.851478', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2423', '2421', '511903', '恩阳区', '3', '0827', '106.654386,31.787186', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2424', '2421', '511921', '通江县', '3', '0827', '107.245033,31.911705', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2425', '2421', '511922', '南江县', '3', '0827', '106.828697,32.346589', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2426', '2421', '511923', '平昌县', '3', '0827', '107.104008,31.560874', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2427', '2277', '512000', '资阳市', '2', '0832', '104.627636,30.128901', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2428', '2427', '512002', '雁江区', '3', '0832', '104.677091,30.108216', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2429', '2427', '512021', '安岳县', '3', '0832', '105.35534,30.103107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2430', '2427', '512022', '乐至县', '3', '0832', '105.02019,30.276121', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2431', '2277', '513200', '阿坝藏族羌族自治州', '2', '0837', '102.224653,31.899413', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2432', '2431', '513201', '马尔康市', '3', '0837', '102.20652,31.905693', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2433', '2431', '513221', '汶川县', '3', '0837', '103.590179,31.476854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2434', '2431', '513222', '理县', '3', '0837', '103.164661,31.435174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2435', '2431', '513223', '茂县', '3', '0837', '103.853363,31.681547', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2436', '2431', '513224', '松潘县', '3', '0837', '103.604698,32.655325', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2437', '2431', '513225', '九寨沟县', '3', '0837', '104.243841,33.252056', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2438', '2431', '513226', '金川县', '3', '0837', '102.063829,31.476277', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2439', '2431', '513227', '小金县', '3', '0837', '102.362984,30.995823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2440', '2431', '513228', '黑水县', '3', '0837', '102.990108,32.061895', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2441', '2431', '513230', '壤塘县', '3', '0837', '100.978526,32.265796', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2442', '2431', '513231', '阿坝县', '3', '0837', '101.706655,32.902459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2443', '2431', '513232', '若尔盖县', '3', '0837', '102.967826,33.578159', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2444', '2431', '513233', '红原县', '3', '0837', '102.544405,32.790891', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2445', '2277', '513300', '甘孜藏族自治州', '2', '0836', '101.96231,30.04952', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2446', '2445', '513301', '康定市', '3', '0836', '101.957146,29.998435', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2447', '2445', '513322', '泸定县', '3', '0836', '102.234617,29.91416', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2448', '2445', '513323', '丹巴县', '3', '0836', '101.890358,30.878577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2449', '2445', '513324', '九龙县', '3', '0836', '101.507294,29.000347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2450', '2445', '513325', '雅江县', '3', '0836', '101.014425,30.031533', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2451', '2445', '513326', '道孚县', '3', '0836', '101.125237,30.979545', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2452', '2445', '513327', '炉霍县', '3', '0836', '100.676372,31.39179', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2453', '2445', '513328', '甘孜县', '3', '0836', '99.99267,31.622933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2454', '2445', '513329', '新龙县', '3', '0836', '100.311368,30.939169', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2455', '2445', '513330', '德格县', '3', '0836', '98.580914,31.806118', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2456', '2445', '513331', '白玉县', '3', '0836', '98.824182,31.209913', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2457', '2445', '513332', '石渠县', '3', '0836', '98.102914,32.97896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2458', '2445', '513333', '色达县', '3', '0836', '100.332743,32.268129', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2459', '2445', '513334', '理塘县', '3', '0836', '100.269817,29.996049', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2460', '2445', '513335', '巴塘县', '3', '0836', '99.110712,30.004677', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2461', '2445', '513336', '乡城县', '3', '0836', '99.798435,28.931172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2462', '2445', '513337', '稻城县', '3', '0836', '100.298403,29.037007', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2463', '2445', '513338', '得荣县', '3', '0836', '99.286335,28.713036', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2464', '2277', '513400', '凉山彝族自治州', '2', '0834', '102.267712,27.88157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2465', '2464', '513401', '西昌市', '3', '0834', '102.264449,27.894504', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2466', '2464', '513422', '木里藏族自治县', '3', '0834', '101.280205,27.928835', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2467', '2464', '513423', '盐源县', '3', '0834', '101.509188,27.422645', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2468', '2464', '513424', '德昌县', '3', '0834', '102.17567,27.402839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2469', '2464', '513425', '会理县', '3', '0834', '102.244683,26.655026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2470', '2464', '513426', '会东县', '3', '0834', '102.57796,26.634669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2471', '2464', '513427', '宁南县', '3', '0834', '102.751745,27.061189', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2472', '2464', '513428', '普格县', '3', '0834', '102.540901,27.376413', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2473', '2464', '513429', '布拖县', '3', '0834', '102.812061,27.706061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2474', '2464', '513430', '金阳县', '3', '0834', '103.248772,27.69686', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2475', '2464', '513431', '昭觉县', '3', '0834', '102.840264,28.015333', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2476', '2464', '513432', '喜德县', '3', '0834', '102.412518,28.306726', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2477', '2464', '513433', '冕宁县', '3', '0834', '102.17701,28.549656', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2478', '2464', '513434', '越西县', '3', '0834', '102.50768,28.639801', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2479', '2464', '513435', '甘洛县', '3', '0834', '102.771504,28.959157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2480', '2464', '513436', '美姑县', '3', '0834', '103.132179,28.32864', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2481', '2464', '513437', '雷波县', '3', '0834', '103.571696,28.262682', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2482', '-1', '520000', '贵州省', '1', '[]', '106.70546,26.600055', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2483', '2482', '520100', '贵阳市', '2', '0851', '106.630153,26.647661', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2484', '2483', '520102', '南明区', '3', '0851', '106.714374,26.567944', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2485', '2483', '520103', '云岩区', '3', '0851', '106.724494,26.604688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2486', '2483', '520111', '花溪区', '3', '0851', '106.67026,26.409817', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2487', '2483', '520112', '乌当区', '3', '0851', '106.750625,26.630845', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2488', '2483', '520113', '白云区', '3', '0851', '106.623007,26.678561', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2489', '2483', '520115', '观山湖区', '3', '0851', '106.622453,26.60145', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2490', '2483', '520121', '开阳县', '3', '0851', '106.965089,27.057764', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2491', '2483', '520122', '息烽县', '3', '0851', '106.740407,27.090479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2492', '2483', '520123', '修文县', '3', '0851', '106.592108,26.838926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2493', '2483', '520181', '清镇市', '3', '0851', '106.470714,26.556079', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2494', '2482', '520200', '六盘水市', '2', '0858', '104.830458,26.592707', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2495', '2494', '520201', '钟山区', '3', '0858', '104.843555,26.574979', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2496', '2494', '520203', '六枝特区', '3', '0858', '105.476608,26.213108', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2497', '2494', '520221', '水城县', '3', '0858', '104.95783,26.547904', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2498', '2494', '520222', '盘州市', '3', '0858', '104.471375,25.709852', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2499', '2482', '520300', '遵义市', '2', '0852', '106.927389,27.725654', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2500', '2499', '520302', '红花岗区', '3', '0852', '106.8937,27.644754', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2501', '2499', '520303', '汇川区', '3', '0852', '106.93427,27.750125', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2502', '2499', '520304', '播州区', '3', '0852', '106.829574,27.536298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2503', '2499', '520322', '桐梓县', '3', '0852', '106.825198,28.133311', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2504', '2499', '520323', '绥阳县', '3', '0852', '107.191222,27.946222', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2505', '2499', '520324', '正安县', '3', '0852', '107.453945,28.553285', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2506', '2499', '520325', '道真仡佬族苗族自治县', '3', '0852', '107.613133,28.862425', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2507', '2499', '520326', '务川仡佬族苗族自治县', '3', '0852', '107.898956,28.563086', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2508', '2499', '520327', '凤冈县', '3', '0852', '107.716355,27.954695', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2509', '2499', '520328', '湄潭县', '3', '0852', '107.465407,27.749055', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2510', '2499', '520329', '余庆县', '3', '0852', '107.905197,27.215491', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2511', '2499', '520330', '习水县', '3', '0852', '106.197137,28.33127', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2512', '2499', '520381', '赤水市', '3', '0852', '105.697472,28.590337', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2513', '2499', '520382', '仁怀市', '3', '0852', '106.40109,27.792514', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2514', '2482', '520400', '安顺市', '2', '0853', '105.947594,26.253088', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2515', '2514', '520402', '西秀区', '3', '0853', '105.965116,26.245315', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2516', '2514', '520403', '平坝区', '3', '0853', '106.256412,26.405715', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2517', '2514', '520422', '普定县', '3', '0853', '105.743277,26.301565', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2518', '2514', '520423', '镇宁布依族苗族自治县', '3', '0853', '105.770283,26.058086', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2519', '2514', '520424', '关岭布依族苗族自治县', '3', '0853', '105.61933,25.94361', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2520', '2514', '520425', '紫云苗族布依族自治县', '3', '0853', '106.084441,25.751047', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2521', '2482', '520500', '毕节市', '2', '0857', '105.291702,27.283908', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2522', '2521', '520502', '七星关区', '3', '0857', '105.30474,27.298458', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2523', '2521', '520521', '大方县', '3', '0857', '105.613037,27.141735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2524', '2521', '520522', '黔西县', '3', '0857', '106.033544,27.007713', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2525', '2521', '520523', '金沙县', '3', '0857', '106.220227,27.459214', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2526', '2521', '520524', '织金县', '3', '0857', '105.770542,26.663449', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2527', '2521', '520525', '纳雍县', '3', '0857', '105.382714,26.777645', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2528', '2521', '520526', '威宁彝族回族苗族自治县', '3', '0857', '104.253071,26.873806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2529', '2521', '520527', '赫章县', '3', '0857', '104.727418,27.123078', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2530', '2482', '520600', '铜仁市', '2', '0856', '109.189598,27.731514', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2531', '2530', '520602', '碧江区', '3', '0856', '109.263998,27.815927', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2532', '2530', '520603', '万山区', '3', '0856', '109.213644,27.517896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2533', '2530', '520621', '江口县', '3', '0856', '108.839557,27.69965', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2534', '2530', '520622', '玉屏侗族自治县', '3', '0856', '108.906411,27.235813', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2535', '2530', '520623', '石阡县', '3', '0856', '108.223612,27.513829', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2536', '2530', '520624', '思南县', '3', '0856', '108.253882,27.93755', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2537', '2530', '520625', '印江土家族苗族自治县', '3', '0856', '108.409751,27.994246', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2538', '2530', '520626', '德江县', '3', '0856', '108.119807,28.263963', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2539', '2530', '520627', '沿河土家族自治县', '3', '0856', '108.50387,28.563927', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2540', '2530', '520628', '松桃苗族自治县', '3', '0856', '109.202886,28.154071', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2541', '2482', '522300', '黔西南布依族苗族自治州', '2', '0859', '104.906397,25.087856', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2542', '2541', '522301', '兴义市', '3', '0859', '104.895467,25.09204', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2543', '2541', '522322', '兴仁县', '3', '0859', '105.186237,25.435183', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2544', '2541', '522323', '普安县', '3', '0859', '104.953062,25.784135', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2545', '2541', '522324', '晴隆县', '3', '0859', '105.218991,25.834783', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2546', '2541', '522325', '贞丰县', '3', '0859', '105.649864,25.38576', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2547', '2541', '522326', '望谟县', '3', '0859', '106.099617,25.178421', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2548', '2541', '522327', '册亨县', '3', '0859', '105.811592,24.983663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2549', '2541', '522328', '安龙县', '3', '0859', '105.442701,25.099014', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2550', '2482', '522600', '黔东南苗族侗族自治州', '2', '0855', '107.982874,26.583457', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2551', '2550', '522601', '凯里市', '3', '0855', '107.97754,26.582963', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2552', '2550', '522622', '黄平县', '3', '0855', '107.916411,26.905396', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2553', '2550', '522623', '施秉县', '3', '0855', '108.124379,27.03292', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2554', '2550', '522624', '三穗县', '3', '0855', '108.675267,26.952967', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2555', '2550', '522625', '镇远县', '3', '0855', '108.429534,27.049497', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2556', '2550', '522626', '岑巩县', '3', '0855', '108.81606,27.173887', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2557', '2550', '522627', '天柱县', '3', '0855', '109.207751,26.909639', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2558', '2550', '522628', '锦屏县', '3', '0855', '109.200534,26.676233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2559', '2550', '522629', '剑河县', '3', '0855', '108.441501,26.728274', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2560', '2550', '522630', '台江县', '3', '0855', '108.321245,26.667525', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2561', '2550', '522631', '黎平县', '3', '0855', '109.136932,26.230706', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2562', '2550', '522632', '榕江县', '3', '0855', '108.52188,25.931893', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2563', '2550', '522633', '从江县', '3', '0855', '108.905329,25.753009', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2564', '2550', '522634', '雷山县', '3', '0855', '108.07754,26.378442', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2565', '2550', '522635', '麻江县', '3', '0855', '107.589359,26.491105', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2566', '2550', '522636', '丹寨县', '3', '0855', '107.788727,26.19832', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2567', '2482', '522700', '黔南布依族苗族自治州', '2', '0854', '107.522171,26.253275', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2568', '2567', '522701', '都匀市', '3', '0854', '107.518847,26.259427', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2569', '2567', '522702', '福泉市', '3', '0854', '107.520386,26.686335', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2570', '2567', '522722', '荔波县', '3', '0854', '107.898882,25.423895', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2571', '2567', '522723', '贵定县', '3', '0854', '107.232793,26.557089', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2572', '2567', '522725', '瓮安县', '3', '0854', '107.470942,27.078441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2573', '2567', '522726', '独山县', '3', '0854', '107.545048,25.822132', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2574', '2567', '522727', '平塘县', '3', '0854', '107.322323,25.822349', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2575', '2567', '522728', '罗甸县', '3', '0854', '106.751589,25.426173', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2576', '2567', '522729', '长顺县', '3', '0854', '106.441805,26.025626', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2577', '2567', '522730', '龙里县', '3', '0854', '106.979524,26.453154', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2578', '2567', '522731', '惠水县', '3', '0854', '106.656442,26.13278', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2579', '2567', '522732', '三都水族自治县', '3', '0854', '107.869749,25.983202', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2580', '-1', '530000', '云南省', '1', '[]', '102.710002,25.045806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2581', '2580', '530100', '昆明市', '2', '0871', '102.832891,24.880095', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2582', '2581', '530102', '五华区', '3', '0871', '102.707262,25.043635', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2583', '2581', '530103', '盘龙区', '3', '0871', '102.751941,25.116465', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2584', '2581', '530111', '官渡区', '3', '0871', '102.749026,24.950231', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2585', '2581', '530112', '西山区', '3', '0871', '102.664382,25.038604', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2586', '2581', '530113', '东川区', '3', '0871', '103.187824,26.082873', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2587', '2581', '530114', '呈贡区', '3', '0871', '102.821675,24.885587', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2588', '2581', '530115', '晋宁区', '3', '0871', '102.595412,24.66974', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2589', '2581', '530124', '富民县', '3', '0871', '102.4976,25.221935', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2590', '2581', '530125', '宜良县', '3', '0871', '103.141603,24.919839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2591', '2581', '530126', '石林彝族自治县', '3', '0871', '103.290536,24.771761', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2592', '2581', '530127', '嵩明县', '3', '0871', '103.036908,25.338643', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2593', '2581', '530128', '禄劝彝族苗族自治县', '3', '0871', '102.471518,25.551332', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2594', '2581', '530129', '寻甸回族彝族自治县', '3', '0871', '103.256615,25.558201', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2595', '2581', '530181', '安宁市', '3', '0871', '102.478494,24.919493', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2596', '2580', '530300', '曲靖市', '2', '0874', '103.796167,25.489999', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2597', '2596', '530302', '麒麟区', '3', '0874', '103.80474,25.495326', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2598', '2596', '530303', '沾益区', '3', '0874', '103.822324,25.600507', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2599', '2596', '530321', '马龙县', '3', '0874', '103.578478,25.42805', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2600', '2596', '530322', '陆良县', '3', '0874', '103.666663,25.030051', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2601', '2596', '530323', '师宗县', '3', '0874', '103.985321,24.822233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2602', '2596', '530324', '罗平县', '3', '0874', '104.308675,24.884626', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2603', '2596', '530325', '富源县', '3', '0874', '104.255014,25.674238', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2604', '2596', '530326', '会泽县', '3', '0874', '103.297386,26.417345', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2605', '2596', '530381', '宣威市', '3', '0874', '104.10455,26.219735', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2606', '2580', '530400', '玉溪市', '2', '0877', '102.527197,24.347324', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2607', '2606', '530402', '红塔区', '3', '0877', '102.540122,24.341215', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2608', '2606', '530403', '江川区', '3', '0877', '102.75344,24.287485', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2609', '2606', '530422', '澄江县', '3', '0877', '102.904629,24.675689', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2610', '2606', '530423', '通海县', '3', '0877', '102.725452,24.111048', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2611', '2606', '530424', '华宁县', '3', '0877', '102.928835,24.19276', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2612', '2606', '530425', '易门县', '3', '0877', '102.162531,24.671651', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2613', '2606', '530426', '峨山彝族自治县', '3', '0877', '102.405819,24.168957', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2614', '2606', '530427', '新平彝族傣族自治县', '3', '0877', '101.990157,24.07005', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2615', '2606', '530428', '元江哈尼族彝族傣族自治县', '3', '0877', '101.998103,23.596503', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2616', '2580', '530500', '保山市', '2', '0875', '99.161761,25.112046', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2617', '2616', '530502', '隆阳区', '3', '0875', '99.165607,25.121154', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2618', '2616', '530521', '施甸县', '3', '0875', '99.189221,24.723064', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2619', '2616', '530523', '龙陵县', '3', '0875', '98.689261,24.586794', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2620', '2616', '530524', '昌宁县', '3', '0875', '99.605142,24.827839', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2621', '2616', '530581', '腾冲市', '3', '0875', '98.490966,25.020439', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2622', '2580', '530600', '昭通市', '2', '0870', '103.717465,27.338257', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2623', '2622', '530602', '昭阳区', '3', '0870', '103.706539,27.320075', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2624', '2622', '530621', '鲁甸县', '3', '0870', '103.558042,27.186659', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2625', '2622', '530622', '巧家县', '3', '0870', '102.930164,26.90846', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2626', '2622', '530623', '盐津县', '3', '0870', '104.234441,28.10871', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2627', '2622', '530624', '大关县', '3', '0870', '103.891146,27.747978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2628', '2622', '530625', '永善县', '3', '0870', '103.638067,28.229112', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2629', '2622', '530626', '绥江县', '3', '0870', '103.968978,28.592099', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2630', '2622', '530627', '镇雄县', '3', '0870', '104.87376,27.441622', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2631', '2622', '530628', '彝良县', '3', '0870', '104.048289,27.625418', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2632', '2622', '530629', '威信县', '3', '0870', '105.049027,27.8469', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2633', '2622', '530630', '水富县', '3', '0870', '104.41603,28.62988', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2634', '2580', '530700', '丽江市', '2', '0888', '100.22775,26.855047', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2635', '2634', '530702', '古城区', '3', '0888', '100.225784,26.876927', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2636', '2634', '530721', '玉龙纳西族自治县', '3', '0888', '100.236954,26.821459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2637', '2634', '530722', '永胜县', '3', '0888', '100.750826,26.684225', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2638', '2634', '530723', '华坪县', '3', '0888', '101.266195,26.629211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2639', '2634', '530724', '宁蒗彝族自治县', '3', '0888', '100.852001,27.28207', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2640', '2580', '530800', '普洱市', '2', '0879', '100.966156,22.825155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2641', '2640', '530802', '思茅区', '3', '0879', '100.977256,22.787115', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2642', '2640', '530821', '宁洱哈尼族彝族自治县', '3', '0879', '101.045837,23.048401', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2643', '2640', '530822', '墨江哈尼族自治县', '3', '0879', '101.692461,23.431894', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2644', '2640', '530823', '景东彝族自治县', '3', '0879', '100.833877,24.446731', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2645', '2640', '530824', '景谷傣族彝族自治县', '3', '0879', '100.702871,23.497028', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2646', '2640', '530825', '镇沅彝族哈尼族拉祜族自治县', '3', '0879', '101.108595,24.004441', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2647', '2640', '530826', '江城哈尼族彝族自治县', '3', '0879', '101.86212,22.585867', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2648', '2640', '530827', '孟连傣族拉祜族佤族自治县', '3', '0879', '99.584157,22.329099', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2649', '2640', '530828', '澜沧拉祜族自治县', '3', '0879', '99.931975,22.555904', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2650', '2640', '530829', '西盟佤族自治县', '3', '0879', '99.590123,22.644508', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2651', '2580', '530900', '临沧市', '2', '0883', '100.08879,23.883955', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2652', '2651', '530902', '临翔区', '3', '0883', '100.082523,23.895137', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2653', '2651', '530921', '凤庆县', '3', '0883', '99.928459,24.580424', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2654', '2651', '530922', '云县', '3', '0883', '100.129354,24.44422', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2655', '2651', '530923', '永德县', '3', '0883', '99.259339,24.018357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2656', '2651', '530924', '镇康县', '3', '0883', '98.825284,23.762584', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2657', '2651', '530925', '双江拉祜族佤族布朗族傣族自治县', '3', '0883', '99.827697,23.473499', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2658', '2651', '530926', '耿马傣族佤族自治县', '3', '0883', '99.397126,23.538092', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2659', '2651', '530927', '沧源佤族自治县', '3', '0883', '99.246196,23.146712', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2660', '2580', '532300', '楚雄彝族自治州', '2', '0878', '101.527992,25.045513', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2661', '2660', '532301', '楚雄市', '3', '0878', '101.545906,25.032889', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2662', '2660', '532322', '双柏县', '3', '0878', '101.641937,24.688875', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2663', '2660', '532323', '牟定县', '3', '0878', '101.546566,25.313121', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2664', '2660', '532324', '南华县', '3', '0878', '101.273577,25.192293', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2665', '2660', '532325', '姚安县', '3', '0878', '101.241728,25.504173', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2666', '2660', '532326', '大姚县', '3', '0878', '101.336617,25.729513', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2667', '2660', '532327', '永仁县', '3', '0878', '101.666132,26.049464', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2668', '2660', '532328', '元谋县', '3', '0878', '101.87452,25.704338', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2669', '2660', '532329', '武定县', '3', '0878', '102.404337,25.530389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2670', '2660', '532331', '禄丰县', '3', '0878', '102.079027,25.150111', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2671', '2580', '532500', '红河哈尼族彝族自治州', '2', '0873', '103.374893,23.363245', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2672', '2671', '532501', '个旧市', '3', '0873', '103.160034,23.359121', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2673', '2671', '532502', '开远市', '3', '0873', '103.266624,23.714523', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2674', '2671', '532503', '蒙自市', '3', '0873', '103.364905,23.396201', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2675', '2671', '532504', '弥勒市', '3', '0873', '103.414874,24.411912', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2676', '2671', '532523', '屏边苗族自治县', '3', '0873', '103.687612,22.983559', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2677', '2671', '532524', '建水县', '3', '0873', '102.826557,23.6347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2678', '2671', '532525', '石屏县', '3', '0873', '102.494983,23.705936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2679', '2671', '532527', '泸西县', '3', '0873', '103.766196,24.532025', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2680', '2671', '532528', '元阳县', '3', '0873', '102.835223,23.219932', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2681', '2671', '532529', '红河县', '3', '0873', '102.4206,23.369161', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2682', '2671', '532530', '金平苗族瑶族傣族自治县', '3', '0873', '103.226448,22.779543', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2683', '2671', '532531', '绿春县', '3', '0873', '102.392463,22.993717', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2684', '2671', '532532', '河口瑶族自治县', '3', '0873', '103.93952,22.529645', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2685', '2580', '532600', '文山壮族苗族自治州', '2', '0876', '104.216248,23.400733', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2686', '2685', '532601', '文山市', '3', '0876', '104.232665,23.386527', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2687', '2685', '532622', '砚山县', '3', '0876', '104.337211,23.605768', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2688', '2685', '532623', '西畴县', '3', '0876', '104.672597,23.437782', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2689', '2685', '532624', '麻栗坡县', '3', '0876', '104.702799,23.125714', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2690', '2685', '532625', '马关县', '3', '0876', '104.394157,23.012915', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2691', '2685', '532626', '丘北县', '3', '0876', '104.166587,24.051746', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2692', '2685', '532627', '广南县', '3', '0876', '105.055107,24.046386', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2693', '2685', '532628', '富宁县', '3', '0876', '105.630999,23.625283', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2694', '2580', '532800', '西双版纳傣族自治州', '2', '0691', '100.796984,22.009113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2695', '2694', '532801', '景洪市', '3', '0691', '100.799545,22.011928', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2696', '2694', '532822', '勐海县', '3', '0691', '100.452547,21.957353', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2697', '2694', '532823', '勐腊县', '3', '0691', '101.564635,21.459233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2698', '2580', '532900', '大理白族自治州', '2', '0872', '100.267638,25.606486', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2699', '2698', '532901', '大理市', '3', '0872', '100.30127,25.678068', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2700', '2698', '532922', '漾濞彝族自治县', '3', '0872', '99.958015,25.670148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2701', '2698', '532923', '祥云县', '3', '0872', '100.550945,25.48385', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2702', '2698', '532924', '宾川县', '3', '0872', '100.590473,25.829828', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2703', '2698', '532925', '弥渡县', '3', '0872', '100.49099,25.343804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2704', '2698', '532926', '南涧彝族自治县', '3', '0872', '100.509035,25.04351', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2705', '2698', '532927', '巍山彝族回族自治县', '3', '0872', '100.307174,25.227212', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2706', '2698', '532928', '永平县', '3', '0872', '99.541236,25.464681', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2707', '2698', '532929', '云龙县', '3', '0872', '99.37112,25.885595', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2708', '2698', '532930', '洱源县', '3', '0872', '99.951053,26.11116', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2709', '2698', '532931', '剑川县', '3', '0872', '99.905559,26.537033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2710', '2698', '532932', '鹤庆县', '3', '0872', '100.176498,26.560231', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2711', '2580', '533100', '德宏傣族景颇族自治州', '2', '0692', '98.584895,24.433353', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2712', '2711', '533102', '瑞丽市', '3', '0692', '97.85559,24.017958', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2713', '2711', '533103', '芒市', '3', '0692', '98.588086,24.43369', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2714', '2711', '533122', '梁河县', '3', '0692', '98.296657,24.804232', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2715', '2711', '533123', '盈江县', '3', '0692', '97.931936,24.705164', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2716', '2711', '533124', '陇川县', '3', '0692', '97.792104,24.182965', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2717', '2580', '533300', '怒江傈僳族自治州', '2', '0886', '98.8566,25.817555', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2718', '2717', '533301', '泸水市', '3', '0886', '98.857977,25.822879', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2719', '2717', '533323', '福贡县', '3', '0886', '98.869132,26.901831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2720', '2717', '533324', '贡山独龙族怒族自治县', '3', '0886', '98.665964,27.740999', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2721', '2717', '533325', '兰坪白族普米族自治县', '3', '0886', '99.416677,26.453571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2722', '2580', '533400', '迪庆藏族自治州', '2', '0887', '99.702583,27.818807', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2723', '2722', '533401', '香格里拉市', '3', '0887', '99.700904,27.829578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2724', '2722', '533422', '德钦县', '3', '0887', '98.911559,28.486163', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2725', '2722', '533423', '维西傈僳族自治县', '3', '0887', '99.287173,27.177161', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2726', '-1', '540000', '西藏自治区', '1', '[]', '91.117525,29.647535', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2727', '2726', '540100', '拉萨市', '2', '0891', '91.172148,29.652341', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2728', '2727', '540102', '城关区', '3', '0891', '91.140552,29.654838', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2729', '2727', '540103', '堆龙德庆区', '3', '0891', '91.003339,29.646063', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2730', '2727', '540121', '林周县', '3', '0891', '91.265287,29.893545', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2731', '2727', '540122', '当雄县', '3', '0891', '91.101162,30.473118', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2732', '2727', '540123', '尼木县', '3', '0891', '90.164524,29.431831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2733', '2727', '540124', '曲水县', '3', '0891', '90.743853,29.353058', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2734', '2727', '540126', '达孜县', '3', '0891', '91.349867,29.66941', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2735', '2727', '540127', '墨竹工卡县', '3', '0891', '91.730732,29.834111', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2736', '2726', '540200', '日喀则市', '2', '0892', '88.880583,29.266869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2737', '2736', '540202', '桑珠孜区', '3', '0892', '88.898483,29.24779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2738', '2736', '540221', '南木林县', '3', '0892', '89.099242,29.68233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2739', '2736', '540222', '江孜县', '3', '0892', '89.605627,28.911626', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2740', '2736', '540223', '定日县', '3', '0892', '87.12612,28.658743', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2741', '2736', '540224', '萨迦县', '3', '0892', '88.021674,28.899664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2742', '2736', '540225', '拉孜县', '3', '0892', '87.63704,29.081659', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2743', '2736', '540226', '昂仁县', '3', '0892', '87.236051,29.294802', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2744', '2736', '540227', '谢通门县', '3', '0892', '88.261664,29.432476', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2745', '2736', '540228', '白朗县', '3', '0892', '89.261977,29.107688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2746', '2736', '540229', '仁布县', '3', '0892', '89.841983,29.230933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2747', '2736', '540230', '康马县', '3', '0892', '89.681663,28.555627', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2748', '2736', '540231', '定结县', '3', '0892', '87.765872,28.364159', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2749', '2736', '540232', '仲巴县', '3', '0892', '84.03153,29.770279', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2750', '2736', '540233', '亚东县', '3', '0892', '88.907093,27.484806', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2751', '2736', '540234', '吉隆县', '3', '0892', '85.297534,28.852393', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2752', '2736', '540235', '聂拉木县', '3', '0892', '85.982237,28.155186', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2753', '2736', '540236', '萨嘎县', '3', '0892', '85.232941,29.328818', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2754', '2736', '540237', '岗巴县', '3', '0892', '88.520031,28.274601', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2755', '2726', '540300', '昌都市', '2', '0895', '97.17202,31.140969', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2756', '2755', '540302', '卡若区', '3', '0895', '97.196021,31.112087', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2757', '2755', '540321', '江达县', '3', '0895', '98.21843,31.499202', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2758', '2755', '540322', '贡觉县', '3', '0895', '98.27097,30.860099', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2759', '2755', '540323', '类乌齐县', '3', '0895', '96.600246,31.211601', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2760', '2755', '540324', '丁青县', '3', '0895', '95.619868,31.409024', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2761', '2755', '540325', '察雅县', '3', '0895', '97.568752,30.653943', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2762', '2755', '540326', '八宿县', '3', '0895', '96.917836,30.053209', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2763', '2755', '540327', '左贡县', '3', '0895', '97.841022,29.671069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2764', '2755', '540328', '芒康县', '3', '0895', '98.593113,29.679907', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2765', '2755', '540329', '洛隆县', '3', '0895', '95.825197,30.741845', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2766', '2755', '540330', '边坝县', '3', '0895', '94.7078,30.933652', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2767', '2726', '540400', '林芝市', '2', '0894', '94.36149,29.649128', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2768', '2767', '540402', '巴宜区', '3', '0894', '94.361094,29.636576', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2769', '2767', '540421', '工布江达县', '3', '0894', '93.246077,29.88528', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2770', '2767', '540422', '米林县', '3', '0894', '94.213679,29.213811', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2771', '2767', '540423', '墨脱县', '3', '0894', '95.333197,29.325298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2772', '2767', '540424', '波密县', '3', '0894', '95.767913,29.859028', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2773', '2767', '540425', '察隅县', '3', '0894', '97.466919,28.66128', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2774', '2767', '540426', '朗县', '3', '0894', '93.074702,29.046337', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2775', '2726', '540500', '山南市', '2', '0893', '91.773134,29.237137', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2776', '2775', '540502', '乃东区', '3', '0893', '91.761538,29.224904', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2777', '2775', '540521', '扎囊县', '3', '0893', '91.33725,29.245113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2778', '2775', '540522', '贡嘎县', '3', '0893', '90.98414,29.289455', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2779', '2775', '540523', '桑日县', '3', '0893', '92.015818,29.259189', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2780', '2775', '540524', '琼结县', '3', '0893', '91.683881,29.024625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2781', '2775', '540525', '曲松县', '3', '0893', '92.203738,29.062826', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2782', '2775', '540526', '措美县', '3', '0893', '91.433509,28.438202', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2783', '2775', '540527', '洛扎县', '3', '0893', '90.859992,28.385713', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2784', '2775', '540528', '加查县', '3', '0893', '92.593993,29.14029', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2785', '2775', '540529', '隆子县', '3', '0893', '92.463308,28.408548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2786', '2775', '540530', '错那县', '3', '0893', '91.960132,27.991707', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2787', '2775', '540531', '浪卡子县', '3', '0893', '90.397977,28.968031', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2788', '2726', '542400', '那曲地区', '2', '0896', '92.052064,31.476479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2789', '2788', '542421', '那曲县', '3', '0896', '92.0535,31.469643', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2790', '2788', '542422', '嘉黎县', '3', '0896', '93.232528,30.640814', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2791', '2788', '542423', '比如县', '3', '0896', '93.679639,31.480249', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2792', '2788', '542424', '聂荣县', '3', '0896', '92.303377,32.10775', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2793', '2788', '542425', '安多县', '3', '0896', '91.68233,32.265176', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2794', '2788', '542426', '申扎县', '3', '0896', '88.709852,30.930505', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2795', '2788', '542427', '索县', '3', '0896', '93.785516,31.886671', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2796', '2788', '542428', '班戈县', '3', '0896', '90.009957,31.392411', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2797', '2788', '542429', '巴青县', '3', '0896', '94.053438,31.91847', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2798', '2788', '542430', '尼玛县', '3', '0896', '87.236772,31.784701', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2799', '2788', '542431', '双湖县', '3', '0896', '88.837641,33.188514', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2800', '2726', '542500', '阿里地区', '2', '0897', '80.105804,32.501111', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2801', '2800', '542521', '普兰县', '3', '0897', '81.176237,30.294402', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2802', '2800', '542522', '札达县', '3', '0897', '79.802706,31.479216', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2803', '2800', '542523', '噶尔县', '3', '0897', '80.096419,32.491488', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2804', '2800', '542524', '日土县', '3', '0897', '79.732427,33.381359', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2805', '2800', '542525', '革吉县', '3', '0897', '81.145433,32.387233', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2806', '2800', '542526', '改则县', '3', '0897', '84.06259,32.302713', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2807', '2800', '542527', '措勤县', '3', '0897', '85.151455,31.017312', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2808', '-1', '610000', '陕西省', '1', '[]', '108.954347,34.265502', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2809', '2808', '610100', '西安市', '2', '029', '108.93977,34.341574', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2810', '2809', '610102', '新城区', '3', '029', '108.960716,34.266447', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2811', '2809', '610103', '碑林区', '3', '029', '108.94059,34.256783', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2812', '2809', '610104', '莲湖区', '3', '029', '108.943895,34.265239', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2813', '2809', '610111', '灞桥区', '3', '029', '109.064646,34.272793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2814', '2809', '610112', '未央区', '3', '029', '108.946825,34.29292', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2815', '2809', '610113', '雁塔区', '3', '029', '108.944644,34.214113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2816', '2809', '610114', '阎良区', '3', '029', '109.226124,34.662232', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2817', '2809', '610115', '临潼区', '3', '029', '109.214237,34.367069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2818', '2809', '610116', '长安区', '3', '029', '108.907173,34.158926', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2819', '2809', '610117', '高陵区', '3', '029', '109.088297,34.534829', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2820', '2809', '610122', '蓝田县', '3', '029', '109.32345,34.151298', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2821', '2809', '610124', '周至县', '3', '029', '108.222162,34.163669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2822', '2809', '610118', '鄠邑区', '3', '029', '108.604894,34.109244', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2823', '2808', '610200', '铜川市', '2', '0919', '108.945019,34.897887', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2824', '2823', '610202', '王益区', '3', '0919', '109.075578,35.068964', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2825', '2823', '610203', '印台区', '3', '0919', '109.099974,35.114492', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2826', '2823', '610204', '耀州区', '3', '0919', '108.980102,34.909793', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2827', '2823', '610222', '宜君县', '3', '0919', '109.116932,35.398577', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2828', '2808', '610300', '宝鸡市', '2', '0917', '107.237743,34.363184', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2829', '2828', '610302', '渭滨区', '3', '0917', '107.155344,34.355068', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2830', '2828', '610303', '金台区', '3', '0917', '107.146806,34.376069', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2831', '2828', '610304', '陈仓区', '3', '0917', '107.369987,34.35147', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2832', '2828', '610322', '凤翔县', '3', '0917', '107.400737,34.521217', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2833', '2828', '610323', '岐山县', '3', '0917', '107.621053,34.443459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2834', '2828', '610324', '扶风县', '3', '0917', '107.900219,34.37541', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2835', '2828', '610326', '眉县', '3', '0917', '107.749766,34.274246', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2836', '2828', '610327', '陇县', '3', '0917', '106.864397,34.89305', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2837', '2828', '610328', '千阳县', '3', '0917', '107.132441,34.642381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2838', '2828', '610329', '麟游县', '3', '0917', '107.793524,34.677902', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2839', '2828', '610330', '凤县', '3', '0917', '106.515803,33.91091', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2840', '2828', '610331', '太白县', '3', '0917', '107.319116,34.058401', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2841', '2808', '610400', '咸阳市', '2', '0910', '108.709136,34.32987', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2842', '2841', '610402', '秦都区', '3', '0910', '108.706272,34.329567', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2843', '2841', '610403', '杨陵区', '3', '0910', '108.084731,34.272117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2844', '2841', '610404', '渭城区', '3', '0910', '108.737204,34.36195', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2845', '2841', '610422', '三原县', '3', '0910', '108.940509,34.617381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2846', '2841', '610423', '泾阳县', '3', '0910', '108.842622,34.527114', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2847', '2841', '610424', '乾县', '3', '0910', '108.239473,34.527551', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2848', '2841', '610425', '礼泉县', '3', '0910', '108.425018,34.481764', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2849', '2841', '610426', '永寿县', '3', '0910', '108.142311,34.691979', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2850', '2841', '610427', '彬县', '3', '0910', '108.077658,35.043911', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2851', '2841', '610428', '长武县', '3', '0910', '107.798757,35.205886', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2852', '2841', '610429', '旬邑县', '3', '0910', '108.333986,35.111978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2853', '2841', '610430', '淳化县', '3', '0910', '108.580681,34.79925', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2854', '2841', '610431', '武功县', '3', '0910', '108.200398,34.260203', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2855', '2841', '610481', '兴平市', '3', '0910', '108.490475,34.29922', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2856', '2808', '610500', '渭南市', '2', '0913', '109.471094,34.52044', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2857', '2856', '610502', '临渭区', '3', '0913', '109.510175,34.499314', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2858', '2856', '610503', '华州区', '3', '0913', '109.775247,34.495915', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2859', '2856', '610522', '潼关县', '3', '0913', '110.246349,34.544296', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2860', '2856', '610523', '大荔县', '3', '0913', '109.941734,34.797259', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2861', '2856', '610524', '合阳县', '3', '0913', '110.149453,35.237988', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2862', '2856', '610525', '澄城县', '3', '0913', '109.93235,35.190245', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2863', '2856', '610526', '蒲城县', '3', '0913', '109.586403,34.955562', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2864', '2856', '610527', '白水县', '3', '0913', '109.590671,35.177451', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2865', '2856', '610528', '富平县', '3', '0913', '109.18032,34.751077', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2866', '2856', '610581', '韩城市', '3', '0913', '110.442846,35.476788', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2867', '2856', '610582', '华阴市', '3', '0913', '110.092078,34.566079', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2868', '2808', '610600', '延安市', '2', '0911', '109.494112,36.651381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2869', '2868', '610602', '宝塔区', '3', '0911', '109.48976,36.585472', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2870', '2868', '610621', '延长县', '3', '0911', '110.012334,36.579313', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2871', '2868', '610622', '延川县', '3', '0911', '110.193514,36.878117', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2872', '2868', '610623', '子长县', '3', '0911', '109.675264,37.142535', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2873', '2868', '610603', '安塞区', '3', '0911', '109.328842,36.863853', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2874', '2868', '610625', '志丹县', '3', '0911', '108.768432,36.822194', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2875', '2868', '610626', '吴起县', '3', '0911', '108.175933,36.927215', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2876', '2868', '610627', '甘泉县', '3', '0911', '109.351019,36.276526', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2877', '2868', '610628', '富县', '3', '0911', '109.379776,35.987953', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2878', '2868', '610629', '洛川县', '3', '0911', '109.432369,35.761974', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2879', '2868', '610630', '宜川县', '3', '0911', '110.168963,36.050178', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2880', '2868', '610631', '黄龙县', '3', '0911', '109.840314,35.584743', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2881', '2868', '610632', '黄陵县', '3', '0911', '109.262961,35.579427', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2882', '2808', '610700', '汉中市', '2', '0916', '107.02305,33.067225', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2883', '2882', '610702', '汉台区', '3', '0916', '107.031856,33.067771', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2884', '2882', '610721', '南郑县', '3', '0916', '106.93623,32.999333', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2885', '2882', '610722', '城固县', '3', '0916', '107.33393,33.157131', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2886', '2882', '610723', '洋县', '3', '0916', '107.545836,33.222738', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2887', '2882', '610724', '西乡县', '3', '0916', '107.766613,32.983101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2888', '2882', '610725', '勉县', '3', '0916', '106.673221,33.153553', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2889', '2882', '610726', '宁强县', '3', '0916', '106.257171,32.829694', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2890', '2882', '610727', '略阳县', '3', '0916', '106.156718,33.327281', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2891', '2882', '610728', '镇巴县', '3', '0916', '107.895035,32.536704', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2892', '2882', '610729', '留坝县', '3', '0916', '106.920808,33.617571', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2893', '2882', '610730', '佛坪县', '3', '0916', '107.990538,33.524359', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2894', '2808', '610800', '榆林市', '2', '0912', '109.734474,38.285369', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2895', '2894', '610802', '榆阳区', '3', '0912', '109.721069,38.277046', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2896', '2894', '610803', '横山区', '3', '0912', '109.294346,37.962208', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2897', '2894', '610881', '神木市', '3', '0912', '110.498939,38.842578', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2898', '2894', '610822', '府谷县', '3', '0912', '111.067276,39.028116', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2899', '2894', '610824', '靖边县', '3', '0912', '108.793988,37.599438', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2900', '2894', '610825', '定边县', '3', '0912', '107.601267,37.594612', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2901', '2894', '610826', '绥德县', '3', '0912', '110.263362,37.50294', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2902', '2894', '610827', '米脂县', '3', '0912', '110.183754,37.755416', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2903', '2894', '610828', '佳县', '3', '0912', '110.491345,38.01951', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2904', '2894', '610829', '吴堡县', '3', '0912', '110.739673,37.452067', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2905', '2894', '610830', '清涧县', '3', '0912', '110.121209,37.088878', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2906', '2894', '610831', '子洲县', '3', '0912', '110.03525,37.610683', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2907', '2808', '610900', '安康市', '2', '0915', '109.029113,32.68481', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2908', '2907', '610902', '汉滨区', '3', '0915', '109.026836,32.695172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2909', '2907', '610921', '汉阴县', '3', '0915', '108.508745,32.893026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2910', '2907', '610922', '石泉县', '3', '0915', '108.247886,33.038408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2911', '2907', '610923', '宁陕县', '3', '0915', '108.314283,33.310527', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2912', '2907', '610924', '紫阳县', '3', '0915', '108.534228,32.520246', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2913', '2907', '610925', '岚皋县', '3', '0915', '108.902049,32.307001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2914', '2907', '610926', '平利县', '3', '0915', '109.361864,32.388854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2915', '2907', '610927', '镇坪县', '3', '0915', '109.526873,31.883672', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2916', '2907', '610928', '旬阳县', '3', '0915', '109.361024,32.832012', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2917', '2907', '610929', '白河县', '3', '0915', '110.112629,32.809026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2918', '2808', '611000', '商洛市', '2', '0914', '109.91857,33.872726', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2919', '2918', '611002', '商州区', '3', '0914', '109.941839,33.862599', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2920', '2918', '611021', '洛南县', '3', '0914', '110.148508,34.090837', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2921', '2918', '611022', '丹凤县', '3', '0914', '110.32733,33.695783', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2922', '2918', '611023', '商南县', '3', '0914', '110.881807,33.530995', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2923', '2918', '611024', '山阳县', '3', '0914', '109.882289,33.532172', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2924', '2918', '611025', '镇安县', '3', '0914', '109.152892,33.423357', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2925', '2918', '611026', '柞水县', '3', '0914', '109.114206,33.68611', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2926', '-1', '620000', '甘肃省', '1', '[]', '103.826447,36.05956', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2927', '2926', '620100', '兰州市', '2', '0931', '103.834303,36.061089', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2928', '2927', '620102', '城关区', '3', '0931', '103.825307,36.057464', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2929', '2927', '620103', '七里河区', '3', '0931', '103.785949,36.066146', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2930', '2927', '620104', '西固区', '3', '0931', '103.627951,36.088552', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2931', '2927', '620105', '安宁区', '3', '0931', '103.719054,36.104579', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2932', '2927', '620111', '红古区', '3', '0931', '102.859323,36.345669', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2933', '2927', '620121', '永登县', '3', '0931', '103.26038,36.736513', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2934', '2927', '620122', '皋兰县', '3', '0931', '103.947377,36.332663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2935', '2927', '620123', '榆中县', '3', '0931', '104.112527,35.843056', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2936', '2926', '620200', '嘉峪关市', '2', '1937', '98.289419,39.772554', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2937', '2926', '620300', '金昌市', '2', '0935', '102.188117,38.520717', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2938', '2937', '620302', '金川区', '3', '0935', '102.194015,38.521087', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2939', '2937', '620321', '永昌县', '3', '0935', '101.984458,38.243434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2940', '2926', '620400', '白银市', '2', '0943', '104.138771,36.545261', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2941', '2940', '620402', '白银区', '3', '0943', '104.148556,36.535398', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2942', '2940', '620403', '平川区', '3', '0943', '104.825208,36.728304', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2943', '2940', '620421', '靖远县', '3', '0943', '104.676774,36.571365', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2944', '2940', '620422', '会宁县', '3', '0943', '105.053358,35.692823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2945', '2940', '620423', '景泰县', '3', '0943', '104.063091,37.183804', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2946', '2926', '620500', '天水市', '2', '0938', '105.724979,34.580885', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2947', '2946', '620502', '秦州区', '3', '0938', '105.724215,34.580888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2948', '2946', '620503', '麦积区', '3', '0938', '105.889556,34.570384', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2949', '2946', '620521', '清水县', '3', '0938', '106.137293,34.749864', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2950', '2946', '620522', '秦安县', '3', '0938', '105.674982,34.858916', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2951', '2946', '620523', '甘谷县', '3', '0938', '105.340747,34.745486', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2952', '2946', '620524', '武山县', '3', '0938', '104.890587,34.72139', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2953', '2946', '620525', '张家川回族自治县', '3', '0938', '106.204517,34.988037', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2954', '2926', '620600', '武威市', '2', '1935', '102.638201,37.928267', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2955', '2954', '620602', '凉州区', '3', '1935', '102.642184,37.928224', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2956', '2954', '620621', '民勤县', '3', '1935', '103.093791,38.62435', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2957', '2954', '620622', '古浪县', '3', '1935', '102.897533,37.47012', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2958', '2954', '620623', '天祝藏族自治县', '3', '1935', '103.141757,36.97174', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2959', '2926', '620700', '张掖市', '2', '0936', '100.449913,38.925548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2960', '2959', '620702', '甘州区', '3', '0936', '100.415096,38.944662', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2961', '2959', '620721', '肃南裕固族自治县', '3', '0936', '99.615601,38.836931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2962', '2959', '620722', '民乐县', '3', '0936', '100.812629,38.430347', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2963', '2959', '620723', '临泽县', '3', '0936', '100.164283,39.152462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2964', '2959', '620724', '高台县', '3', '0936', '99.819519,39.378311', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2965', '2959', '620725', '山丹县', '3', '0936', '101.088529,38.784505', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2966', '2926', '620800', '平凉市', '2', '0933', '106.665061,35.542606', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2967', '2966', '620802', '崆峒区', '3', '0933', '106.674767,35.542491', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2968', '2966', '620821', '泾川县', '3', '0933', '107.36785,35.332666', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2969', '2966', '620822', '灵台县', '3', '0933', '107.595874,35.070027', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2970', '2966', '620823', '崇信县', '3', '0933', '107.025763,35.305596', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2971', '2966', '620824', '华亭县', '3', '0933', '106.653158,35.218292', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2972', '2966', '620825', '庄浪县', '3', '0933', '106.036686,35.202385', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2973', '2966', '620826', '静宁县', '3', '0933', '105.732556,35.521976', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2974', '2926', '620900', '酒泉市', '2', '0937', '98.493927,39.732795', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2975', '2974', '620902', '肃州区', '3', '0937', '98.507843,39.744953', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2976', '2974', '620921', '金塔县', '3', '0937', '98.901252,39.983955', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2977', '2974', '620922', '瓜州县', '3', '0937', '95.782318,40.520538', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2978', '2974', '620923', '肃北蒙古族自治县', '3', '0937', '94.876579,39.51245', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2979', '2974', '620924', '阿克塞哈萨克族自治县', '3', '0937', '94.340204,39.633943', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2980', '2974', '620981', '玉门市', '3', '0937', '97.045661,40.292106', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2981', '2974', '620982', '敦煌市', '3', '0937', '94.661941,40.142089', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2982', '2926', '621000', '庆阳市', '2', '0934', '107.643571,35.70898', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2983', '2982', '621002', '西峰区', '3', '0934', '107.651077,35.730652', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2984', '2982', '621021', '庆城县', '3', '0934', '107.881802,36.016299', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2985', '2982', '621022', '环县', '3', '0934', '107.308501,36.568434', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2986', '2982', '621023', '华池县', '3', '0934', '107.990062,36.461306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2987', '2982', '621024', '合水县', '3', '0934', '108.019554,35.819194', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2988', '2982', '621025', '正宁县', '3', '0934', '108.359865,35.49178', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2989', '2982', '621026', '宁县', '3', '0934', '107.928371,35.502176', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2990', '2982', '621027', '镇原县', '3', '0934', '107.200832,35.677462', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2991', '2926', '621100', '定西市', '2', '0932', '104.592225,35.606978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2992', '2991', '621102', '安定区', '3', '0932', '104.610668,35.580629', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2993', '2991', '621121', '通渭县', '3', '0932', '105.24206,35.210831', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2994', '2991', '621122', '陇西县', '3', '0932', '104.634983,35.00394', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2995', '2991', '621123', '渭源县', '3', '0932', '104.215467,35.136755', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2996', '2991', '621124', '临洮县', '3', '0932', '103.859565,35.394988', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2997', '2991', '621125', '漳县', '3', '0932', '104.471572,34.848444', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2998', '2991', '621126', '岷县', '3', '0932', '104.03688,34.438075', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('2999', '2926', '621200', '陇南市', '2', '2935', '104.960851,33.37068', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3000', '2999', '621202', '武都区', '3', '2935', '104.926337,33.392211', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3001', '2999', '621221', '成县', '3', '2935', '105.742424,33.75061', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3002', '2999', '621222', '文县', '3', '2935', '104.683433,32.943815', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3003', '2999', '621223', '宕昌县', '3', '2935', '104.393385,34.047261', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3004', '2999', '621224', '康县', '3', '2935', '105.609169,33.329136', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3005', '2999', '621225', '西和县', '3', '2935', '105.298756,34.014215', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3006', '2999', '621226', '礼县', '3', '2935', '105.17864,34.189345', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3007', '2999', '621227', '徽县', '3', '2935', '106.08778,33.768826', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3008', '2999', '621228', '两当县', '3', '2935', '106.304966,33.908917', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3009', '2926', '622900', '临夏回族自治州', '2', '0930', '103.210655,35.601352', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3010', '3009', '622901', '临夏市', '3', '0930', '103.243021,35.604376', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3011', '3009', '622921', '临夏县', '3', '0930', '103.039826,35.478722', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3012', '3009', '622922', '康乐县', '3', '0930', '103.708354,35.370505', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3013', '3009', '622923', '永靖县', '3', '0930', '103.285853,35.958306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3014', '3009', '622924', '广河县', '3', '0930', '103.575834,35.488051', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3015', '3009', '622925', '和政县', '3', '0930', '103.350997,35.424603', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3016', '3009', '622926', '东乡族自治县', '3', '0930', '103.389346,35.663752', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3017', '3009', '622927', '积石山保安族东乡族撒拉族自治县', '3', '0930', '102.875843,35.71766', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3018', '2926', '623000', '甘南藏族自治州', '2', '0941', '102.910995,34.983409', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3019', '3018', '623001', '合作市', '3', '0941', '102.910484,35.000286', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3020', '3018', '623021', '临潭县', '3', '0941', '103.353919,34.692747', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3021', '3018', '623022', '卓尼县', '3', '0941', '103.507109,34.589588', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3022', '3018', '623023', '舟曲县', '3', '0941', '104.251482,33.793631', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3023', '3018', '623024', '迭部县', '3', '0941', '103.221869,34.055938', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3024', '3018', '623025', '玛曲县', '3', '0941', '102.072698,33.997712', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3025', '3018', '623026', '碌曲县', '3', '0941', '102.487327,34.590944', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3026', '3018', '623027', '夏河县', '3', '0941', '102.521807,35.202503', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3027', '-1', '630000', '青海省', '1', '[]', '101.780268,36.620939', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3028', '3027', '630100', '西宁市', '2', '0971', '101.778223,36.617134', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3029', '3028', '630102', '城东区', '3', '0971', '101.803717,36.599744', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3030', '3028', '630103', '城中区', '3', '0971', '101.705298,36.545652', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3031', '3028', '630104', '城西区', '3', '0971', '101.765843,36.628304', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3032', '3028', '630105', '城北区', '3', '0971', '101.766228,36.650038', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3033', '3028', '630121', '大通回族土族自治县', '3', '0971', '101.685643,36.926954', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3034', '3028', '630122', '湟中县', '3', '0971', '101.571667,36.500879', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3035', '3028', '630123', '湟源县', '3', '0971', '101.256464,36.682426', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3036', '3027', '630200', '海东市', '2', '0972', '102.104287,36.502039', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3037', '3036', '630202', '乐都区', '3', '0972', '102.401724,36.482058', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3038', '3036', '630203', '平安区', '3', '0972', '102.108834,36.500563', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3039', '3036', '630222', '民和回族土族自治县', '3', '0972', '102.830892,36.320321', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3040', '3036', '630223', '互助土族自治县', '3', '0972', '101.959271,36.844248', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3041', '3036', '630224', '化隆回族自治县', '3', '0972', '102.264143,36.094908', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3042', '3036', '630225', '循化撒拉族自治县', '3', '0972', '102.489135,35.851152', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3043', '3027', '632200', '海北藏族自治州', '2', '0970', '100.900997,36.954413', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3044', '3043', '632221', '门源回族自治县', '3', '0970', '101.611539,37.388746', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3045', '3043', '632222', '祁连县', '3', '0970', '100.253211,38.177112', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3046', '3043', '632223', '海晏县', '3', '0970', '100.99426,36.896359', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3047', '3043', '632224', '刚察县', '3', '0970', '100.145833,37.32547', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3048', '3027', '632300', '黄南藏族自治州', '2', '0973', '102.015248,35.519548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3049', '3048', '632321', '同仁县', '3', '0973', '102.018323,35.516063', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3050', '3048', '632322', '尖扎县', '3', '0973', '102.04014,35.943156', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3051', '3048', '632323', '泽库县', '3', '0973', '101.466689,35.035313', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3052', '3048', '632324', '河南蒙古族自治县', '3', '0973', '101.617503,34.734568', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3053', '3027', '632500', '海南藏族自治州', '2', '0974', '100.622692,36.296529', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3054', '3053', '632521', '共和县', '3', '0974', '100.620031,36.284107', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3055', '3053', '632522', '同德县', '3', '0974', '100.578051,35.25479', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3056', '3053', '632523', '贵德县', '3', '0974', '101.433391,36.040166', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3057', '3053', '632524', '兴海县', '3', '0974', '99.987965,35.588612', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3058', '3053', '632525', '贵南县', '3', '0974', '100.747503,35.586714', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3059', '3027', '632600', '果洛藏族自治州', '2', '0975', '100.244808,34.471431', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3060', '3059', '632621', '玛沁县', '3', '0975', '100.238888,34.477433', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3061', '3059', '632622', '班玛县', '3', '0975', '100.737138,32.932723', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3062', '3059', '632623', '甘德县', '3', '0975', '99.900923,33.969216', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3063', '3059', '632624', '达日县', '3', '0975', '99.651392,33.74892', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3064', '3059', '632625', '久治县', '3', '0975', '101.482831,33.429471', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3065', '3059', '632626', '玛多县', '3', '0975', '98.209206,34.915946', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3066', '3027', '632700', '玉树藏族自治州', '2', '0976', '97.091934,33.011674', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3067', '3066', '632701', '玉树市', '3', '0976', '97.008784,32.993106', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3068', '3066', '632722', '杂多县', '3', '0976', '95.300723,32.893185', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3069', '3066', '632723', '称多县', '3', '0976', '97.110831,33.369218', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3070', '3066', '632724', '治多县', '3', '0976', '95.61896,33.844956', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3071', '3066', '632725', '囊谦县', '3', '0976', '96.48943,32.203432', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3072', '3066', '632726', '曲麻莱县', '3', '0976', '95.797367,34.126428', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3073', '3027', '632800', '海西蒙古族藏族自治州', '2', '0977', '97.369751,37.377139', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3074', '3073', '632801', '格尔木市', '3', '0977', '94.928453,36.406367', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3075', '3073', '632802', '德令哈市', '3', '0977', '97.360984,37.369436', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3076', '3073', '632821', '乌兰县', '3', '0977', '98.480195,36.929749', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3077', '3073', '632822', '都兰县', '3', '0977', '98.095844,36.302496', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3078', '3073', '632823', '天峻县', '3', '0977', '99.022984,37.300851', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3079', '3073', '632825', '海西蒙古族藏族自治州直辖', '3', '0977', '95.356546,37.853328', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3080', '-1', '640000', '宁夏回族自治区', '1', '[]', '106.259126,38.472641', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3081', '3080', '640100', '银川市', '2', '0951', '106.230909,38.487193', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3082', '3081', '640104', '兴庆区', '3', '0951', '106.28865,38.473609', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3083', '3081', '640105', '西夏区', '3', '0951', '106.161106,38.502605', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3084', '3081', '640106', '金凤区', '3', '0951', '106.239679,38.47436', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3085', '3081', '640121', '永宁县', '3', '0951', '106.253145,38.277372', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3086', '3081', '640122', '贺兰县', '3', '0951', '106.349861,38.554599', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3087', '3081', '640181', '灵武市', '3', '0951', '106.340053,38.102655', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3088', '3080', '640200', '石嘴山市', '2', '0952', '106.383303,38.983236', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3089', '3088', '640202', '大武口区', '3', '0952', '106.367958,39.01918', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3090', '3088', '640205', '惠农区', '3', '0952', '106.781176,39.239302', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3091', '3088', '640221', '平罗县', '3', '0952', '106.523474,38.913544', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3092', '3080', '640300', '吴忠市', '2', '0953', '106.198913,37.997428', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3093', '3092', '640302', '利通区', '3', '0953', '106.212613,37.98349', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3094', '3092', '640303', '红寺堡区', '3', '0953', '106.062113,37.425702', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3095', '3092', '640323', '盐池县', '3', '0953', '107.407358,37.783205', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3096', '3092', '640324', '同心县', '3', '0953', '105.895309,36.95449', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3097', '3092', '640381', '青铜峡市', '3', '0953', '106.078817,38.021302', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3098', '3080', '640400', '固原市', '2', '0954', '106.24261,36.015855', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3099', '3098', '640402', '原州区', '3', '0954', '106.287781,36.003739', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3100', '3098', '640422', '西吉县', '3', '0954', '105.729085,35.963912', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3101', '3098', '640423', '隆德县', '3', '0954', '106.111595,35.625914', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3102', '3098', '640424', '泾源县', '3', '0954', '106.330646,35.498159', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3103', '3098', '640425', '彭阳县', '3', '0954', '106.631809,35.858815', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3104', '3080', '640500', '中卫市', '2', '1953', '105.196902,37.499972', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3105', '3104', '640502', '沙坡头区', '3', '1953', '105.173721,37.516883', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3106', '3104', '640521', '中宁县', '3', '1953', '105.685218,37.491546', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3107', '3104', '640522', '海原县', '3', '1953', '105.643487,36.565033', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3108', '-1', '650000', '新疆维吾尔自治区', '1', '[]', '87.627704,43.793026', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3109', '3108', '659002', '阿拉尔市', '2', '1997', '81.280527,40.547653', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3110', '3108', '659005', '北屯市', '2', '1906', '87.837075,47.332643', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3111', '3108', '659008', '可克达拉市', '2', '1999', '81.044542,43.944798', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3112', '3108', '659009', '昆玉市', '2', '1903', '79.291083,37.209642', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3113', '3108', '659001', '石河子市', '2', '0993', '86.080602,44.306097', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3114', '3108', '659007', '双河市', '2', '1909', '82.353656,44.840524', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3115', '3108', '650100', '乌鲁木齐市', '2', '0991', '87.616848,43.825592', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3116', '3115', '650102', '天山区', '3', '0991', '87.631676,43.794399', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3117', '3115', '650103', '沙依巴克区', '3', '0991', '87.598195,43.800939', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3118', '3115', '650104', '新市区', '3', '0991', '87.569431,43.855378', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3119', '3115', '650105', '水磨沟区', '3', '0991', '87.642481,43.832459', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3120', '3115', '650106', '头屯河区', '3', '0991', '87.428141,43.877664', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3121', '3115', '650107', '达坂城区', '3', '0991', '88.311099,43.363668', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3122', '3115', '650109', '米东区', '3', '0991', '87.655935,43.974784', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3123', '3115', '650121', '乌鲁木齐县', '3', '0991', '87.409417,43.47136', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3124', '3108', '650200', '克拉玛依市', '2', '0990', '84.889207,45.579888', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3125', '3124', '650202', '独山子区', '3', '0990', '84.886974,44.328095', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3126', '3124', '650203', '克拉玛依区', '3', '0990', '84.867844,45.602525', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3127', '3124', '650204', '白碱滩区', '3', '0990', '85.131696,45.687854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3128', '3124', '650205', '乌尔禾区', '3', '0990', '85.693742,46.089148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3129', '3108', '650400', '吐鲁番市', '2', '0995', '89.189752,42.951303', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3130', '3129', '650402', '高昌区', '3', '0995', '89.185877,42.942327', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3131', '3129', '650421', '鄯善县', '3', '0995', '90.21333,42.868744', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3132', '3129', '650422', '托克逊县', '3', '0995', '88.653827,42.792526', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3133', '3108', '650500', '哈密市', '2', '0902', '93.515224,42.819541', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3134', '3133', '650502', '伊州区', '3', '0902', '93.514797,42.827254', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3135', '3133', '650521', '巴里坤哈萨克自治县', '3', '0902', '93.010383,43.599929', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3136', '3133', '650522', '伊吾县', '3', '0902', '94.697074,43.254978', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3137', '3108', '652300', '昌吉回族自治州', '2', '0994', '87.308224,44.011182', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3138', '3137', '652301', '昌吉市', '3', '0994', '87.267532,44.014435', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3139', '3137', '652302', '阜康市', '3', '0994', '87.952991,44.164402', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3140', '3137', '652323', '呼图壁县', '3', '0994', '86.871584,44.179361', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3141', '3137', '652324', '玛纳斯县', '3', '0994', '86.20368,44.284722', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3142', '3137', '652325', '奇台县', '3', '0994', '89.593967,44.022066', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3143', '3137', '652327', '吉木萨尔县', '3', '0994', '89.180437,44.000497', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3144', '3137', '652328', '木垒哈萨克自治县', '3', '0994', '90.286028,43.834689', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3145', '3108', '652700', '博尔塔拉蒙古自治州', '2', '0909', '82.066363,44.906039', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3146', '3145', '652701', '博乐市', '3', '0909', '82.051004,44.853869', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3147', '3145', '652702', '阿拉山口市', '3', '0909', '82.559396,45.172227', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3148', '3145', '652722', '精河县', '3', '0909', '82.890656,44.599393', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3149', '3145', '652723', '温泉县', '3', '0909', '81.024816,44.968856', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3150', '3108', '652800', '巴音郭楞蒙古自治州', '2', '0996', '86.145297,41.764115', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3151', '3150', '652801', '库尔勒市', '3', '0996', '86.174633,41.725891', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3152', '3150', '652822', '轮台县', '3', '0996', '84.252156,41.777702', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3153', '3150', '652823', '尉犁县', '3', '0996', '86.261321,41.343933', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3154', '3150', '652824', '若羌县', '3', '0996', '88.167152,39.023241', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3155', '3150', '652825', '且末县', '3', '0996', '85.529702,38.145485', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3156', '3150', '652826', '焉耆回族自治县', '3', '0996', '86.574067,42.059759', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3157', '3150', '652827', '和静县', '3', '0996', '86.384065,42.323625', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3158', '3150', '652828', '和硕县', '3', '0996', '86.876799,42.284331', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3159', '3150', '652829', '博湖县', '3', '0996', '86.631997,41.980152', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3160', '3108', '652900', '阿克苏地区', '2', '0997', '80.260605,41.168779', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3161', '3160', '652901', '阿克苏市', '3', '0997', '80.263387,41.167548', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3162', '3160', '652922', '温宿县', '3', '0997', '80.238959,41.276688', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3163', '3160', '652923', '库车县', '3', '0997', '82.987312,41.714696', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3164', '3160', '652924', '沙雅县', '3', '0997', '82.781818,41.221666', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3165', '3160', '652925', '新和县', '3', '0997', '82.618736,41.551206', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3166', '3160', '652926', '拜城县', '3', '0997', '81.85148,41.795912', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3167', '3160', '652927', '乌什县', '3', '0997', '79.224616,41.222319', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3168', '3160', '652928', '阿瓦提县', '3', '0997', '80.375053,40.643647', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3169', '3160', '652929', '柯坪县', '3', '0997', '79.054497,40.501936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3170', '3108', '653000', '克孜勒苏柯尔克孜自治州', '2', '0908', '76.167819,39.714526', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3171', '3170', '653001', '阿图什市', '3', '0908', '76.1684,39.71616', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3172', '3170', '653022', '阿克陶县', '3', '0908', '75.947396,39.147785', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3173', '3170', '653023', '阿合奇县', '3', '0908', '78.446253,40.936936', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3174', '3170', '653024', '乌恰县', '3', '0908', '75.259227,39.71931', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3175', '3108', '653100', '喀什地区', '2', '0998', '75.989741,39.47046', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3176', '3175', '653101', '喀什市', '3', '0998', '75.99379,39.467685', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3177', '3175', '653121', '疏附县', '3', '0998', '75.862813,39.375043', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3178', '3175', '653122', '疏勒县', '3', '0998', '76.048139,39.401384', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3179', '3175', '653123', '英吉沙县', '3', '0998', '76.175729,38.930381', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3180', '3175', '653124', '泽普县', '3', '0998', '77.259675,38.18529', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3181', '3175', '653125', '莎车县', '3', '0998', '77.245761,38.41422', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3182', '3175', '653126', '叶城县', '3', '0998', '77.413836,37.882989', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3183', '3175', '653127', '麦盖提县', '3', '0998', '77.610125,38.898001', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3184', '3175', '653128', '岳普湖县', '3', '0998', '76.8212,39.2198', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3185', '3175', '653129', '伽师县', '3', '0998', '76.723719,39.488181', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3186', '3175', '653130', '巴楚县', '3', '0998', '78.549296,39.785155', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3187', '3175', '653131', '塔什库尔干塔吉克自治县', '3', '0998', '75.229889,37.772094', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3188', '3108', '653200', '和田地区', '2', '0903', '79.922211,37.114157', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3189', '3188', '653201', '和田市', '3', '0903', '79.913534,37.112148', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3190', '3188', '653221', '和田县', '3', '0903', '79.81907,37.120031', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3191', '3188', '653222', '墨玉县', '3', '0903', '79.728683,37.277143', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3192', '3188', '653223', '皮山县', '3', '0903', '78.283669,37.62145', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3193', '3188', '653224', '洛浦县', '3', '0903', '80.188986,37.073667', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3194', '3188', '653225', '策勒县', '3', '0903', '80.806159,36.998335', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3195', '3188', '653226', '于田县', '3', '0903', '81.677418,36.85708', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3196', '3188', '653227', '民丰县', '3', '0903', '82.695861,37.06408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3197', '3108', '654000', '伊犁哈萨克自治州', '2', '0999', '81.324136,43.916823', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3198', '3197', '654002', '伊宁市', '3', '0999', '81.27795,43.908558', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3199', '3197', '654003', '奎屯市', '3', '0999', '84.903267,44.426529', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3200', '3197', '654004', '霍尔果斯市', '3', '0999', '80.411271,44.213941', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3201', '3197', '654021', '伊宁县', '3', '0999', '81.52745,43.977119', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3202', '3197', '654022', '察布查尔锡伯自治县', '3', '0999', '81.151337,43.840726', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3203', '3197', '654023', '霍城县', '3', '0999', '80.87898,44.055984', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3204', '3197', '654024', '巩留县', '3', '0999', '82.231718,43.482628', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3205', '3197', '654025', '新源县', '3', '0999', '83.232848,43.433896', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3206', '3197', '654026', '昭苏县', '3', '0999', '81.130974,43.157293', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3207', '3197', '654027', '特克斯县', '3', '0999', '81.836206,43.217183', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3208', '3197', '654028', '尼勒克县', '3', '0999', '82.511809,43.800247', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3209', '3108', '654200', '塔城地区', '2', '0901', '82.980316,46.745364', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3210', '3209', '654201', '塔城市', '3', '0901', '82.986978,46.751428', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3211', '3209', '654202', '乌苏市', '3', '0901', '84.713396,44.41881', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3212', '3209', '654221', '额敏县', '3', '0901', '83.628303,46.524673', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3213', '3209', '654223', '沙湾县', '3', '0901', '85.619416,44.326388', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3214', '3209', '654224', '托里县', '3', '0901', '83.60695,45.947638', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3215', '3209', '654225', '裕民县', '3', '0901', '82.982667,46.201104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3216', '3209', '654226', '和布克赛尔蒙古自治县', '3', '0901', '85.728328,46.793235', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3217', '3108', '654300', '阿勒泰地区', '2', '0906', '88.141253,47.844924', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3218', '3217', '654301', '阿勒泰市', '3', '0906', '88.131842,47.827308', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3219', '3217', '654321', '布尔津县', '3', '0906', '86.874923,47.702163', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3220', '3217', '654322', '富蕴县', '3', '0906', '89.525504,46.994115', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3221', '3217', '654323', '福海县', '3', '0906', '87.486703,47.111918', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3222', '3217', '654324', '哈巴河县', '3', '0906', '86.418621,48.060846', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3223', '3217', '654325', '青河县', '3', '0906', '90.37555,46.679113', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3224', '3217', '654326', '吉木乃县', '3', '0906', '85.874096,47.443101', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3225', '3108', '659006', '铁门关市', '2', '1996', '85.501217,41.82725', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3226', '3108', '659003', '图木舒克市', '2', '1998', '79.073963,39.868965', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3227', '3108', '659004', '五家渠市', '2', '1994', '87.54324,44.166756', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3228', '-1', '710000', '台湾省', '1', '1886', '121.509062,25.044332', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3229', '-1', '810000', '香港特别行政区', '1', '1852', '114.171203,22.277468', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3230', '3229', '810001', '中西区', '3', '1852', '114.154373,22.281981', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3231', '3229', '810002', '湾仔区', '3', '1852', '114.182915,22.276389', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3232', '3229', '810003', '东区', '3', '1852', '114.226003,22.279693', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3233', '3229', '810004', '南区', '3', '1852', '114.160012,22.245897', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3234', '3229', '810005', '油尖旺区', '3', '1852', '114.173332,22.311704', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3235', '3229', '810006', '深水埗区', '3', '1852', '114.163242,22.333854', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3236', '3229', '810007', '九龙城区', '3', '1852', '114.192847,22.31251', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3237', '3229', '810008', '黄大仙区', '3', '1852', '114.203886,22.336321', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3238', '3229', '810009', '观塘区', '3', '1852', '114.214054,22.320838', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3239', '3229', '810010', '荃湾区', '3', '1852', '114.121079,22.368306', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3240', '3229', '810011', '屯门区', '3', '1852', '113.976574,22.393844', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3241', '3229', '810012', '元朗区', '3', '1852', '114.032438,22.441428', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3243', '3229', '810013', '北区', '3', '1852', '114.147364,22.496104', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3245', '3229', '810014', '大埔区', '3', '1852', '114.171743,22.445653', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3246', '3229', '810015', '西贡区', '3', '1852', '114.264645,22.314213', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3247', '3229', '810016', '沙田区', '3', '1852', '114.195365,22.379532', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3248', '3229', '810017', '葵青区', '3', '1852', '114.139319,22.363877', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3249', '3229', '810018', '离岛区', '3', '1852', '113.94612,22.286408', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3251', '-1', '820000', '澳门特别行政区', '1', '1853', '113.543028,22.186835', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3252', '3251', '820001', '花地玛堂区', '3', '1853', '113.552896,22.20787', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3253', '3251', '820002', '花王堂区', '3', '1853', '113.548961,22.199207', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3254', '3251', '820003', '望德堂区', '3', '1853', '113.550183,22.193721', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3255', '3251', '820004', '大堂区', '3', '1853', '113.553647,22.188539', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3256', '3251', '820005', '风顺堂区', '3', '1853', '113.541928,22.187368', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3257', '3251', '820006', '嘉模堂区', '3', '1853', '113.558705,22.15376', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3258', '3251', '820007', '路凼填海区', '3', '1853', '113.569599,22.13663', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);
INSERT INTO `sys_area` VALUES ('3259', '3251', '820008', '圣方济各堂区', '3', '1853', '113.559954,22.123486', '2020-12-19 22:50:55.996683', null, '2020-12-19 22:51:02.805634', null);

-- ----------------------------
-- Table structure for sys_comment
-- ----------------------------
DROP TABLE IF EXISTS `sys_comment`;
CREATE TABLE `sys_comment` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `commentId` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '评论 id',
  `replyId` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '回复目标 id',
  `replyType` tinyint(4) NOT NULL COMMENT '回复类型',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '回复内容',
  `fromUid` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '回复用户 id',
  `toUid` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '目标用户 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_comment
-- ----------------------------

-- ----------------------------
-- Table structure for sys_dict
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict`;
CREATE TABLE `sys_dict` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `dictName` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '字典名称',
  `dictCode` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '字典编码',
  `type` tinyint(4) DEFAULT '0' COMMENT '字典类型（0：string；1：number；）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_dict
-- ----------------------------
INSERT INTO `sys_dict` VALUES ('0da20d9a-3161-4f45-92dd-e5183d362c4c', '1', '', '2021-08-07 02:04:14.510940', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.510940', null, '0', null, null, '文章类型', 'article', '0');
INSERT INTO `sys_dict` VALUES ('2d0cb100-4b1b-48ef-8b1c-57429bac5e8c', '1', '', '2021-08-07 02:01:58.101370', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:58.101370', null, '0', null, null, '删除类型', 'delete', '0');
INSERT INTO `sys_dict` VALUES ('9b566677-a809-4879-984b-1fe60a0dcb68', '1', '', '2021-08-07 02:03:05.407799', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.407799', null, '0', null, null, '性别类型', 'sex', '0');
INSERT INTO `sys_dict` VALUES ('d210f0d6-984c-43b7-905a-b7db139e4b49', '1', '', '2021-08-07 02:02:35.700726', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.700726', null, '0', null, null, '用户类型', 'user', '0');
INSERT INTO `sys_dict` VALUES ('d6d46c10-c36f-444b-a5e2-baa8f771e921', '1', '', '2021-08-07 02:01:13.022870', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:13.022870', null, '0', null, null, '状态类型', 'status', '0');

-- ----------------------------
-- Table structure for sys_dict_item
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_item`;
CREATE TABLE `sys_dict_item` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `parentId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '父 id',
  `itemText` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '字典项名称',
  `itemValue` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '字典项值',
  `defaultValue` tinyint(4) NOT NULL COMMENT '默认值（0：否；1：是）',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  `dictId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  KEY `FK_d3b250cf3cf827b56103cab2f33` (`dictId`),
  CONSTRAINT `FK_d3b250cf3cf827b56103cab2f33` FOREIGN KEY (`dictId`) REFERENCES `sys_dict` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_dict_item
-- ----------------------------
INSERT INTO `sys_dict_item` VALUES ('05437b01-d8de-44a5-b3cb-da26cae22778', '1', '', '2021-08-07 02:02:35.755356', null, '2021-08-07 02:02:35.755356', null, '0', null, null, null, '管理员', '1', '0', '0', 'd210f0d6-984c-43b7-905a-b7db139e4b49');
INSERT INTO `sys_dict_item` VALUES ('0a5652fb-4aba-459e-add8-8e00c5547afc', '1', '', '2021-08-07 02:04:14.453170', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.453170', null, '0', null, null, null, '音频', '5', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('0f253952-afed-47a0-839a-0aacea70d0d9', '1', '', '2021-08-07 02:03:05.533324', null, '2021-08-07 02:03:05.533324', null, '0', null, null, null, '男', '2', '0', '0', '9b566677-a809-4879-984b-1fe60a0dcb68');
INSERT INTO `sys_dict_item` VALUES ('16e6ca48-137c-457e-af5f-be5584a32621', '1', '', '2021-08-07 02:04:14.698535', null, '2021-08-07 02:04:14.698535', null, '0', null, null, null, '视频', '4', '0', '0', '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('1a6067ec-0581-41dd-b27e-79f022151683', '1', '', '2021-08-07 02:04:14.611353', null, '2021-08-07 02:04:14.611353', null, '0', null, null, null, '图片', '2', '0', '0', '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('203a0d19-4d23-47e7-9fb9-2a8b58ff7604', '1', '', '2021-08-07 02:04:14.649841', null, '2021-08-07 02:04:14.649841', null, '0', null, null, null, '组图', '3', '0', '0', '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('301b6540-d27b-453a-b5dd-c2621232e8c3', '1', '', '2021-08-07 02:04:14.712922', null, '2021-08-07 02:04:14.712922', null, '0', null, null, null, '音频', '5', '0', '0', '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('326133c2-d233-43a6-b63a-0efb262c2679', '1', '启用或发布', '2021-08-07 02:01:12.708214', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.708214', null, '0', null, null, null, '启用', '1', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('37bc616d-ce97-44d0-813e-73d75f21adce', '1', '', '2021-08-07 02:01:12.970026', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.970026', null, '0', null, null, null, '回收站', '3', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('38cef812-a931-4781-9adf-a35e080265da', '1', '', '2021-08-07 02:04:14.296267', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.296267', null, '0', null, null, null, '组图', '3', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('40e60724-bb54-4de0-ad6d-11348a196b94', '1', '', '2021-08-07 02:03:05.253818', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.253818', null, '0', null, null, null, '女', '1', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('4aafdceb-db70-4daf-8c60-437af19d4d19', '1', '', '2021-08-07 02:01:57.900607', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:57.900607', null, '0', null, null, null, '未删除', '0', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('598171e3-f17d-4a97-a6f8-1c96a88adc42', '1', '', '2021-08-07 02:01:13.118536', null, '2021-08-07 02:01:13.118536', null, '0', null, null, null, '草稿', '2', '0', '0', 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('5d81178b-3281-4e29-b0e0-70d3f430ea50', '1', '', '2021-08-07 02:02:35.453249', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.453249', null, '0', null, null, null, '管理员', '1', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('5f5bd5ee-3e9f-4507-992b-de82453cf996', '1', '', '2021-08-07 02:01:12.828760', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.828760', null, '0', null, null, null, '草稿', '2', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('6eeab8b1-4776-4774-a625-8ed1e2be18bc', '1', '', '2021-08-07 02:04:14.137122', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.137122', null, '0', null, null, null, '链接', '1', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('7060ca10-3793-4d5c-8965-169ad3675558', '1', '', '2021-08-07 02:04:14.390838', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.390838', null, '0', null, null, null, '视频', '4', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('70fcac4e-6e37-4ca4-ba57-51aad73fea8d', '1', '', '2021-08-07 02:03:05.499454', null, '2021-08-07 02:03:05.499454', null, '0', null, null, null, '女', '1', '0', '0', '9b566677-a809-4879-984b-1fe60a0dcb68');
INSERT INTO `sys_dict_item` VALUES ('765cc924-a4c3-4373-a9b0-946904509278', '1', '禁用或未发布', '2021-08-07 02:01:13.069079', null, '2021-08-07 02:01:13.069079', null, '0', null, null, null, '禁用', '0', '0', '0', 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('76d819da-a4fa-4fd4-8e83-bd0bb5f7026a', '1', '', '2021-08-07 02:03:05.445580', null, '2021-08-07 02:03:05.445580', null, '0', null, null, null, '保密', '0', '0', '0', '9b566677-a809-4879-984b-1fe60a0dcb68');
INSERT INTO `sys_dict_item` VALUES ('83228b8a-4053-445e-b60a-7485c4f7ec00', '1', '启用或发布', '2021-08-07 02:01:13.100108', null, '2021-08-07 02:01:13.100108', null, '0', null, null, null, '启用', '1', '0', '0', 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('83809831-7ddb-4ade-aa19-176650fe8e93', '1', '', '2021-08-07 02:03:05.119061', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.119061', null, '0', null, null, null, '保密', '0', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('8b80ef5e-3785-4c73-bc1e-de7acc983430', '1', '', '2021-08-07 02:04:14.236696', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:14.236696', null, '0', null, null, null, '图片', '2', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('90d4a1e0-51a4-4f15-b65f-2ac2ef21014a', '1', '', '2021-08-07 02:04:13.956155', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:04:13.956155', null, '0', null, null, null, '文本', '0', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('9c79c318-e4a5-486e-b6b6-e86a469e85ad', '1', '', '2021-08-07 02:02:35.767081', null, '2021-08-07 02:02:35.767081', null, '0', null, null, null, '超级管理员', '2', '0', '0', 'd210f0d6-984c-43b7-905a-b7db139e4b49');
INSERT INTO `sys_dict_item` VALUES ('a2b2e744-fc81-4016-be0a-3e624aba73a6', '1', '', '2021-08-07 02:04:14.552966', null, '2021-08-07 02:04:14.552966', null, '0', null, null, null, '文本', '0', '0', '0', '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('ae909cda-4a8b-4e2e-8c26-e8026be545b6', '1', '', '2021-08-07 02:01:13.151168', null, '2021-08-07 02:01:13.151168', null, '0', null, null, null, '回收站', '3', '0', '0', 'd6d46c10-c36f-444b-a5e2-baa8f771e921');
INSERT INTO `sys_dict_item` VALUES ('cd874bba-de55-4522-b80b-f2aa26f1156c', '1', '', '2021-08-07 02:02:35.734147', null, '2021-08-07 02:02:35.734147', null, '0', null, null, null, '普通用户', '0', '0', '0', 'd210f0d6-984c-43b7-905a-b7db139e4b49');
INSERT INTO `sys_dict_item` VALUES ('d1a36917-175b-4a10-9d55-268a6d7ed987', '1', '', '2021-08-07 02:01:58.137991', null, '2021-08-07 02:01:58.137991', null, '0', null, null, null, '未删除', '0', '0', '0', '2d0cb100-4b1b-48ef-8b1c-57429bac5e8c');
INSERT INTO `sys_dict_item` VALUES ('d3e2e0cc-f1e2-4749-914c-f267db2c211d', '1', '', '2021-08-07 02:01:58.039578', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:58.039578', null, '0', null, null, null, '删除', '1', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('e76f51a8-954d-47ba-889c-a73f64bb6fd0', '1', '', '2021-08-07 02:04:14.593432', null, '2021-08-07 02:04:14.593432', null, '0', null, null, null, '链接', '1', '0', '0', '0da20d9a-3161-4f45-92dd-e5183d362c4c');
INSERT INTO `sys_dict_item` VALUES ('ee14147c-0535-4a4e-9a5c-5333dc353f3a', '1', '', '2021-08-07 02:03:05.348345', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:03:05.348345', null, '0', null, null, null, '男', '2', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('ee730406-f4ce-4a94-ab04-2a9cbc3cfdc5', '1', '禁用或未发布', '2021-08-07 02:01:12.583524', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:01:12.583524', null, '0', null, null, null, '禁用', '0', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('fa1764d9-7a9b-4eaf-aca8-d95e7d409181', '1', '', '2021-08-07 02:02:35.605572', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.605572', null, '0', null, null, null, '超级管理员', '2', '0', '0', null);
INSERT INTO `sys_dict_item` VALUES ('fa32a75c-d095-4b64-9756-a60890f6f58d', '1', '', '2021-08-07 02:01:58.234676', null, '2021-08-07 02:01:58.234676', null, '0', null, null, null, '删除', '1', '0', '0', '2d0cb100-4b1b-48ef-8b1c-57429bac5e8c');
INSERT INTO `sys_dict_item` VALUES ('fef8bb62-7663-490c-beb9-8f0b59431063', '1', '', '2021-08-07 02:02:35.358522', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 02:02:35.358522', null, '0', null, null, null, '普通用户', '0', '0', '0', null);

-- ----------------------------
-- Table structure for sys_file
-- ----------------------------
DROP TABLE IF EXISTS `sys_file`;
CREATE TABLE `sys_file` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `originalName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件原始名称',
  `encoding` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件编码',
  `mimeType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件 mimeType 类型',
  `destination` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件目录',
  `fileName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件名称',
  `path` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件路径',
  `size` int(11) DEFAULT NULL COMMENT '文件大小',
  `fileType` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件类型',
  `fileUrl` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件地址',
  `fileDisName` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '文件显示名称',
  `extId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '关联 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_file
-- ----------------------------

-- ----------------------------
-- Table structure for sys_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_group`;
CREATE TABLE `sys_group` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_group
-- ----------------------------
INSERT INTO `sys_group` VALUES ('0078b5ce-ba44-45c8-9a02-142d085cb311', '1', '游客', '2021-08-07 00:52:03.708245', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:52:03.708245', null, '0', null, null, '游客');
INSERT INTO `sys_group` VALUES ('0950c980-ab23-4244-8e0f-ce70e9628e13', '1', '管理员', '2021-08-07 00:51:28.351289', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:51:28.351289', null, '0', null, null, '管理员');
INSERT INTO `sys_group` VALUES ('c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', '1', '用户', '2021-08-07 00:51:44.197858', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:51:44.197858', null, '0', null, null, '用户');
INSERT INTO `sys_group` VALUES ('ef439baf-ba10-4662-b394-b91938a256e5', '1', '运营', '2021-08-07 00:52:15.403309', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:52:15.403309', null, '0', null, null, '运营');

-- ----------------------------
-- Table structure for sys_group_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_group_role`;
CREATE TABLE `sys_group_role` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `groupId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  `roleId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  KEY `FK_db3609e0b29fc26d93abc69e4df` (`groupId`),
  KEY `FK_064c66c3c1a2f8fe7ed4b42dff8` (`roleId`),
  CONSTRAINT `FK_064c66c3c1a2f8fe7ed4b42dff8` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_db3609e0b29fc26d93abc69e4df` FOREIGN KEY (`groupId`) REFERENCES `sys_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_group_role
-- ----------------------------
INSERT INTO `sys_group_role` VALUES ('0122cfd6-6034-409e-a787-da101b88ab99', 'c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', '983fea12-af42-4c00-a5d7-053614ca0a5c');
INSERT INTO `sys_group_role` VALUES ('228adb4b-1cbf-4e29-be5b-c1a429cec08b', 'c61ecdb2-ca08-4bfd-afbe-8a86ea53f438', 'c11cf8fb-d40b-4acc-becf-3eb7a92fa477');
INSERT INTO `sys_group_role` VALUES ('5af1c079-93cb-4bfb-8375-f7abcb9889c4', 'ef439baf-ba10-4662-b394-b91938a256e5', 'd4a7ab71-d161-424d-96da-2bca8c80ed7c');
INSERT INTO `sys_group_role` VALUES ('6a8eb969-015c-45c7-b454-85bc45f312eb', 'ef439baf-ba10-4662-b394-b91938a256e5', '424185b8-06df-43bf-b9f9-1e1cecf1a9ec');
INSERT INTO `sys_group_role` VALUES ('78b9e52b-0bec-45bf-93d4-32dd61f335ae', '0950c980-ab23-4244-8e0f-ce70e9628e13', '26622aaf-bfa4-460e-a88b-d133ba10d01e');
INSERT INTO `sys_group_role` VALUES ('88b90000-45f2-4bf3-b027-5fbdbe2722e1', '0950c980-ab23-4244-8e0f-ce70e9628e13', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab');

-- ----------------------------
-- Table structure for sys_holiday
-- ----------------------------
DROP TABLE IF EXISTS `sys_holiday`;
CREATE TABLE `sys_holiday` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '名称',
  `date` date NOT NULL COMMENT '日期',
  `weekday` tinyint(4) DEFAULT NULL COMMENT '周几（1：一；2：二；3：三；4：四；5：五；6：六；0：日）',
  `restType` tinyint(4) DEFAULT NULL COMMENT '类型（0：工作日；1：法定节假日；2：休息日加班；3：休息日）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_holiday
-- ----------------------------

-- ----------------------------
-- Table structure for sys_org
-- ----------------------------
DROP TABLE IF EXISTS `sys_org`;
CREATE TABLE `sys_org` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `parentId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '父 id',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '机构名称',
  `shortName` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '机构简称',
  `orgType` tinyint(4) NOT NULL COMMENT '机构类型（0：机构；1：部门；)',
  `orgLevel` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '机构级次码',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_org
-- ----------------------------
INSERT INTO `sys_org` VALUES ('16c8e260-a8cd-47b1-89bf-5c3e14f16bd8', '1', '', '2021-08-07 01:23:23.777916', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:29:17.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, null, '片片海协调科技发展有限公司', '片片海', '0', '003000000');
INSERT INTO `sys_org` VALUES ('24b2bc6b-d807-4e3b-afec-1e36c23a2479', '1', '', '2021-08-07 01:25:06.492863', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:28:01.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, '877451ad-b564-47eb-825b-958b6302aed6', '人事部', null, '1', '001004000');
INSERT INTO `sys_org` VALUES ('4b189366-9334-4f16-a9e2-9fcb81d48ddd', '1', '', '2021-08-07 01:23:36.539771', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:30:17.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, null, '武汉优品楚鼎科技有限公司', '优品', '0', '002000000');
INSERT INTO `sys_org` VALUES ('877451ad-b564-47eb-825b-958b6302aed6', '1', '', '2021-08-07 01:23:56.605494', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:30:35.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, null, '武汉佳软信息技术有限公司', '佳软', '0', '001000000');
INSERT INTO `sys_org` VALUES ('c0538323-cb03-4603-8d6a-9f881e82afc4', '1', '', '2021-08-07 01:24:41.796777', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:27:26.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, '877451ad-b564-47eb-825b-958b6302aed6', '项目二部', null, '1', '001002000');
INSERT INTO `sys_org` VALUES ('c0ce7f52-bfd8-4a4a-9157-8340741877e6', '1', '', '2021-08-07 01:24:26.635954', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:26:49.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, '877451ad-b564-47eb-825b-958b6302aed6', '项目一部', null, '1', '001001000');
INSERT INTO `sys_org` VALUES ('d2143c17-b14c-4a55-be60-a4be59106668', '1', '', '2021-08-07 01:24:53.212135', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:27:37.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, '877451ad-b564-47eb-825b-958b6302aed6', '项目三部', null, '1', '001003000');
INSERT INTO `sys_org` VALUES ('e6dc87dc-be22-4bad-b706-95169bb64ac3', '1', '', '2021-08-07 01:25:21.885246', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:28:09.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, '877451ad-b564-47eb-825b-958b6302aed6', '商务部', null, '1', '001005000');

-- ----------------------------
-- Table structure for sys_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_permission`;
CREATE TABLE `sys_permission` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `parentId` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '父 id',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `sort` int(11) DEFAULT '0' COMMENT '权限 SORT',
  `type` tinyint(4) NOT NULL COMMENT '权限类别（1：目录；2：菜单；3：操作；4：字段；5：数据）',
  `code` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '权限 CODE 代码',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `routerComponent` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '权限路由 COMPONENT',
  `routerHidden` tinyint(4) DEFAULT NULL COMMENT '权限路由 HIDDEN（0：显示；1：隐藏；）',
  `routerIcon` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '权限路由 ICON',
  `routerPath` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '权限路由 PATH',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_permission
-- ----------------------------
INSERT INTO `sys_permission` VALUES ('06953b13-d8d0-493e-a630-792ddcacfef5', 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '岗位列表', '160', '2', null, '1', '', '2021-08-07 01:02:58.601088', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:58.601088', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb', 'c9b7eb18-db9d-4935-846e-32c93407905a', '删除', '113', '3', 'account:user:delete', '1', '', '2021-08-07 01:08:08.304193', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:08:08.304193', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('10417cf5-f095-4abd-a9f0-5e8e8bcafb3c', '6d304bad-996b-40d5-a43a-7bab9ead2744', '添加', '211', '3', 'cms:article:add', '1', null, '2021-08-07 11:38:44.862212', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.862212', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('10ba71b0-69ba-402c-b19b-6d2ec4c8018a', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '批量删除', '124', '3', 'account:group:deleteBatch', '1', null, '2021-08-07 11:04:59.406351', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:59.406351', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('10dd853b-9272-4cd6-93bc-4a03bab7a18f', 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '权限列表', '140', '2', null, '1', '', '2021-08-07 01:02:34.057082', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:34.057082', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('250b7a06-2dbb-4c76-b483-1bd3542f1b99', '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '编辑', '142', '3', 'account:permission:edit', '1', null, '2021-08-07 11:32:42.196404', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.196404', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('2531bbd4-f502-4818-af8c-d545e225547d', '06953b13-d8d0-493e-a630-792ddcacfef5', '批量删除', '164', '3', 'account:post:deleteBatch', '1', null, '2021-08-07 11:38:44.769408', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.769408', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('25eef5c4-55de-4487-9812-28e76d238e7b', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '分配权限', '136', '3', 'cms:role:bindPermissions', '1', null, '2021-08-07 11:51:37.924803', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.924803', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('2b552e47-8a30-4ecc-a183-797e85db8ef5', 'c9b7eb18-db9d-4935-846e-32c93407905a', '导出 EXCEL', '115', '3', 'account:user:exportExcel', '1', '', '2021-08-07 01:09:14.291728', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:09:14.291728', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('306e4a38-9e71-4e77-b66d-4aab6a0d94e5', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '添加', '131', '3', 'account:role:add', '1', null, '2021-08-07 11:07:10.260672', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:10.260672', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('31292492-7a02-446c-b509-6ad4884beb0', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '编辑', '122', '3', 'account:group:edit', '1', null, '2021-08-07 11:04:05.739022', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:05.739022', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('3abf143e-9da9-4750-9c4f-d01cc02ac4f5', 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户组列表', '120', '2', null, '1', '', '2021-08-07 01:01:28.916468', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:01:28.916468', null, '0', null, null, 'account/group-list.vue', '0', 'group', 'account/group-list');
INSERT INTO `sys_permission` VALUES ('4313ded5-ee99-49cb-88fd-44b70dc0bef1', null, '广告管理', '200', '1', null, '1', '', '2021-08-07 01:09:53.809433', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:09:53.809433', null, '0', null, null, null, '0', 'ads', null);
INSERT INTO `sys_permission` VALUES ('4365dca5-ba7b-4233-92d7-f31fdb01aaa8', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '编辑', '132', '3', 'account:role:edit', '1', null, '2021-08-07 11:07:27.112174', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:27.112174', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('4379e01f-ccd0-4f11-b410-bb2636b767cc', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '删除', '133', '3', 'account:role:delete', '1', null, '2021-08-07 11:07:54.374588', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:07:54.374588', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('484a14c2-82f9-4818-afd9-959ddccc5a96', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '导出 EXCEL', '125', '3', 'account:group:exportExcel', '1', null, '2021-08-07 11:05:13.683272', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:05:13.683272', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('4d4a312c-7046-4872-9efb-18af351296d5', '6d304bad-996b-40d5-a43a-7bab9ead2744', '删除', '213', '3', 'cms:article:delete', '1', null, '2021-08-07 11:38:44.969581', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.969581', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('547eba13-1039-4cc6-9719-6fb79d304a4c', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '编辑', '152', '3', 'account:org:edit', '1', null, '2021-08-07 11:32:42.282497', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.282497', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('5d40f3ed-67f4-4147-9da6-3637a52324e1', '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '添加', '141', '3', 'account:permission:add', '1', null, '2021-08-07 11:32:42.177006', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.177006', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('63343802-c2a5-4cdf-a0ee-0a620c5c5926', '06953b13-d8d0-493e-a630-792ddcacfef5', '导出 EXCEL', '165', '3', 'account:post:exportExcel', '1', null, '2021-08-07 11:38:44.827421', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.827421', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('636423f6-0657-412a-951a-80caa3930f21', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '导出 EXCEL', '235', '3', 'cms:articleCat:exportExcel', '1', null, '2021-08-07 11:42:45.122572', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:45.122572', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('66a7e4f0-46ad-4642-b348-0c85ee5860af', '06953b13-d8d0-493e-a630-792ddcacfef5', '添加', '161', '3', 'account:post:add', '1', null, '2021-08-07 11:38:44.558244', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.558244', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('676cec2a-d9ff-4961-9213-499369b1c902', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '添加', '231', '3', 'cms:articleCat:add', '1', null, '2021-08-07 11:42:44.799968', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.799968', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('67f7c348-8bdb-486e-8585-e579e90b43c3', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '批量删除', '234', '3', 'cms:articleCat:deleteBatch', '1', null, '2021-08-07 11:42:45.047540', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:45.047540', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('6a5aee9a-2739-429f-83db-ebd2ec656205', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '批量删除', '134', '3', 'account:role:deleteBatch', '1', null, '2021-08-07 11:08:11.156613', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:08:11.156613', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('6d304bad-996b-40d5-a43a-7bab9ead2744', '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '广告列表', '210', '2', null, '1', '', '2021-08-07 01:10:25.568965', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:10:25.568965', null, '0', null, null, null, '0', 'ads', null);
INSERT INTO `sys_permission` VALUES ('78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '角色列表', '130', '2', null, '1', '', '2021-08-07 01:02:19.758726', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:19.758726', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('843528e7-3a86-4b12-b433-f93bcccbc7e7', '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '导出 EXCEL', '145', '3', 'account:permission:exportExcel', '1', null, '2021-08-07 11:32:42.246868', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.246868', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('862d3a38-afac-4f7d-ab26-07ab7a258feb', '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '批量删除', '144', '3', 'account:permission:deleteBatch', '1', null, '2021-08-07 11:32:42.232150', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.232150', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('887460aa-df2c-47e3-bb13-116aec0fcd25', '10dd853b-9272-4cd6-93bc-4a03bab7a18f', '删除', '143', '3', 'account:permission:delete', '1', null, '2021-08-07 11:32:42.216184', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.216184', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('8d8814dc-e3ce-426c-8188-67c2dba77f72', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb', '导出 EXCEL', '135', '3', 'account:role:exportExcel', '1', null, '2021-08-07 11:08:30.792743', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:08:30.792743', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('969dcc20-b24f-4fd4-be01-141e294bd14e', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '删除', '153', '3', 'account:org:delete', '1', null, '2021-08-07 11:32:42.296168', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.296168', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('98af51d3-573b-4b3b-822e-df44ba01be91', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '编辑', '232', '3', 'cms:articleCat:edit', '1', null, '2021-08-07 11:42:44.891699', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.891699', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('a0526cc2-26b4-4588-b822-e48643a58583', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '导出 EXCEL', '155', '3', 'account:org:exportExcel', '1', null, '2021-08-07 11:32:42.324574', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.324574', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('a27048fe-6403-4234-97a9-545fc67b9d81', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206', '删除', '233', '3', 'cms:articleCat:delete', '1', null, '2021-08-07 11:42:44.957332', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:42:44.957332', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('a3c5c8ec-69ca-4c0f-b6a0-27d11f81775b', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '批量删除', '154', '3', 'account:org:deleteBatch', '1', null, '2021-08-07 11:32:42.311247', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.311247', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('a52040ca-ded7-4ca3-b94c-b492871d25fb', 'c9b7eb18-db9d-4935-846e-32c93407905a', '添加', '111', '3', 'account:user:add', '1', '', '2021-08-07 01:06:35.862749', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:06:35.862749', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('b2f8ef54-dc2a-47fe-8e88-fa025866bcfe', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', '添加', '151', '3', 'account:org:add', '1', null, '2021-08-07 11:32:42.264030', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:32:42.264030', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('b4225a25-e636-4ada-b781-d7213cef053e', '6d304bad-996b-40d5-a43a-7bab9ead2744', '批量删除', '214', '3', 'cms:article:deleteBatch', '1', null, '2021-08-07 11:38:45.052498', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:45.052498', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7', 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '机构列表', '150', '2', null, '1', '', '2021-08-07 01:02:45.322043', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:02:45.322043', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('b9b8e480-1a2b-409b-918a-c5969e65d900', 'c9b7eb18-db9d-4935-846e-32c93407905a', '批量删除', '114', '3', 'account:user:deleteBatch', '1', '', '2021-08-07 10:58:52.176087', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 10:58:52.176087', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('ba3334a6-d382-4fc9-8e40-6f4f134d2206', '4313ded5-ee99-49cb-88fd-44b70dc0bef1', '栏目列表', '230', '2', null, '1', '', '2021-08-07 01:10:41.554006', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:10:41.554006', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('c8a27d18-898a-46c7-9be1-666344cccc51', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '添加', '121', '3', 'account:group:add', '1', null, '2021-08-07 11:03:42.266733', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:03:42.266733', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('c9b7eb18-db9d-4935-846e-32c93407905a', 'ef2db655-1acb-4aed-bbe6-0c12020d0562', '用户列表', '110', '2', null, '1', '', '2021-08-07 01:00:10.988174', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:03:42.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, 'account/user/user-list.vue', '0', 'peoples', 'account/user/user-list');
INSERT INTO `sys_permission` VALUES ('d6cdc6a9-f040-4dfa-9d68-2e0c15eafcd9', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '删除', '123', '3', 'account:group:delete', '1', null, '2021-08-07 11:04:35.882150', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:04:35.882150', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('e7c705cb-c734-4160-b5bd-b15bf022dbe6', '06953b13-d8d0-493e-a630-792ddcacfef5', '编辑', '162', '3', 'account:post:edit', '1', null, '2021-08-07 11:38:44.608468', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.608468', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('ef2db655-1acb-4aed-bbe6-0c12020d0562', null, '账户管理', '100', '1', null, '1', '', '2021-08-07 00:58:01.100343', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:03:33.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, null, '0', 'user', 'account/user');
INSERT INTO `sys_permission` VALUES ('f25c0cb5-8c15-4569-8c24-32a60c3c07a0', 'c9b7eb18-db9d-4935-846e-32c93407905a', '编辑', '112', '3', 'account:user:edit', '1', '', '2021-08-07 01:07:31.300966', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:07:31.300966', null, '0', null, null, null, '0', null, null);
INSERT INTO `sys_permission` VALUES ('f49f5232-fd18-447f-bc48-9c0aa111351f', 'c9b7eb18-db9d-4935-846e-32c93407905a', '分配角色', '117', '3', 'cms:user:bindRoles', '1', null, '2021-08-07 11:51:37.852192', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.852192', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('f52db313-0ab2-42d7-8e30-524b4ab308f6', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5', '分配角色', '126', '3', 'cms:grogp:bindRoles', '1', null, '2021-08-07 11:51:37.888762', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.888762', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('f777da84-c818-4f58-ae72-41a2a43fc500', '6d304bad-996b-40d5-a43a-7bab9ead2744', '导出 EXCEL', '215', '3', 'cms:article:exportExcel', '1', null, '2021-08-07 11:38:45.077979', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:45.077979', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('f7a3c83a-d4b6-4776-9c99-ca6ccc005004', '6d304bad-996b-40d5-a43a-7bab9ead2744', '编辑', '212', '3', 'cms:article:edit', '1', null, '2021-08-07 11:38:44.898247', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.898247', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('f8a16ae2-78ea-4be6-85d7-2c02b76ea9ab', '06953b13-d8d0-493e-a630-792ddcacfef5', '删除', '163', '3', 'account:post:delete', '1', null, '2021-08-07 11:38:44.644037', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:38:44.644037', null, '0', null, null, null, null, null, null);
INSERT INTO `sys_permission` VALUES ('fb65a555-d8f5-4581-a61c-10309c38835e', 'c9b7eb18-db9d-4935-846e-32c93407905a', '分配用户组', '116', '3', 'cms:user:bindGroups', '1', null, '2021-08-07 11:51:37.712827', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 11:51:37.712827', null, '0', null, null, null, null, null, null);

-- ----------------------------
-- Table structure for sys_post
-- ----------------------------
DROP TABLE IF EXISTS `sys_post`;
CREATE TABLE `sys_post` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '岗位名称',
  `sort` int(11) NOT NULL DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_post
-- ----------------------------
INSERT INTO `sys_post` VALUES ('2131469d-a86a-407a-93db-cbb9f434c836', '1', '', '2021-08-07 01:22:48.058919', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:48.058919', null, '0', null, null, '产品经理', '0');
INSERT INTO `sys_post` VALUES ('7dfef594-176f-4d2f-962c-30c0541b2526', '1', '', '2021-08-07 01:22:04.349356', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:04.349356', null, '0', null, null, '开发', '0');
INSERT INTO `sys_post` VALUES ('8482cf36-2249-4712-814c-c7c2e3c272fb', '1', '', '2021-08-07 01:22:36.484242', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:36.484242', null, '0', null, null, '项目经理', '0');
INSERT INTO `sys_post` VALUES ('bf20018f-3b08-430b-8aea-56051873e3cb', '1', '', '2021-08-07 01:22:18.468089', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:18.468089', null, '0', null, null, '测试', '0');
INSERT INTO `sys_post` VALUES ('e6463cb3-47f7-4427-a8c2-dfd216b8f4cc', '1', '', '2021-08-07 01:22:11.958332', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 01:22:11.958332', null, '0', null, null, '运营', '0');

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `name` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('26622aaf-bfa4-460e-a88b-d133ba10d01e', '1', '', '2021-08-07 00:53:48.222151', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:53:48.222151', null, '0', null, null, '普通管理员');
INSERT INTO `sys_role` VALUES ('424185b8-06df-43bf-b9f9-1e1cecf1a9ec', '1', '', '2021-08-07 00:54:45.058381', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:45.058381', null, '0', null, null, '宣传运营');
INSERT INTO `sys_role` VALUES ('983fea12-af42-4c00-a5d7-053614ca0a5c', '1', '', '2021-08-07 00:54:09.555852', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:09.555852', null, '0', null, null, '管理端用户');
INSERT INTO `sys_role` VALUES ('c11cf8fb-d40b-4acc-becf-3eb7a92fa477', '1', '', '2021-08-07 00:54:21.593555', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:21.593555', null, '0', null, null, '客户端用户');
INSERT INTO `sys_role` VALUES ('cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '1', '', '2021-08-07 00:53:13.754279', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:53:13.754279', null, '0', null, null, '超级管理员');
INSERT INTO `sys_role` VALUES ('d4a7ab71-d161-424d-96da-2bca8c80ed7c', '1', '', '2021-08-07 00:54:55.148290', '518e81b2-0bda-4729-be21-d25c94a424ff', '2021-08-07 00:54:55.148290', null, '0', null, null, '营销运营');

-- ----------------------------
-- Table structure for sys_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_permission`;
CREATE TABLE `sys_role_permission` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `roleId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  `permissionId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  KEY `FK_12e7dc0ca4c0c09f11d50a3a499` (`roleId`),
  KEY `FK_b357d42a45f488a0270d3f928b2` (`permissionId`),
  CONSTRAINT `FK_12e7dc0ca4c0c09f11d50a3a499` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_b357d42a45f488a0270d3f928b2` FOREIGN KEY (`permissionId`) REFERENCES `sys_permission` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_role_permission
-- ----------------------------
INSERT INTO `sys_role_permission` VALUES ('091b95e9-3771-4a88-8e49-70c50e5eedc5', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '67f7c348-8bdb-486e-8585-e579e90b43c3');
INSERT INTO `sys_role_permission` VALUES ('096bffc8-ef29-4162-a82a-9902797c61ca', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '63343802-c2a5-4cdf-a0ee-0a620c5c5926');
INSERT INTO `sys_role_permission` VALUES ('142a23b8-2e71-4398-be86-17dd7721a37b', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a52040ca-ded7-4ca3-b94c-b492871d25fb');
INSERT INTO `sys_role_permission` VALUES ('1a43d2d7-ab42-4cf2-a627-44464b96947f', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '862d3a38-afac-4f7d-ab26-07ab7a258feb');
INSERT INTO `sys_role_permission` VALUES ('1b0a1bf6-ff00-4d05-84f9-21831d9a66a2', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4379e01f-ccd0-4f11-b410-bb2636b767cc');
INSERT INTO `sys_role_permission` VALUES ('1b79682e-121e-41be-9428-f0d8c27db197', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '547eba13-1039-4cc6-9719-6fb79d304a4c');
INSERT INTO `sys_role_permission` VALUES ('1c4e2dc4-5dd3-4103-bcdd-aef815726ff5', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f25c0cb5-8c15-4569-8c24-32a60c3c07a0');
INSERT INTO `sys_role_permission` VALUES ('1ce3f5ab-8991-4501-9f71-f0ddb8e80931', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f777da84-c818-4f58-ae72-41a2a43fc500');
INSERT INTO `sys_role_permission` VALUES ('218add49-51e8-4200-a5bd-376606aa6d79', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'c9b7eb18-db9d-4935-846e-32c93407905a');
INSERT INTO `sys_role_permission` VALUES ('25b37b48-dd61-4e4a-aa13-45d15f662edf', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '2b552e47-8a30-4ecc-a183-797e85db8ef5');
INSERT INTO `sys_role_permission` VALUES ('2645e8a8-b925-4cc4-b931-abfb910964cf', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b4225a25-e636-4ada-b781-d7213cef053e');
INSERT INTO `sys_role_permission` VALUES ('2a1358df-9e9d-4f1e-819d-bf1ca29d039a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10dd853b-9272-4cd6-93bc-4a03bab7a18f');
INSERT INTO `sys_role_permission` VALUES ('2d154e9a-9f29-4f8c-9e74-e0af7fa9c52d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '5d40f3ed-67f4-4147-9da6-3637a52324e1');
INSERT INTO `sys_role_permission` VALUES ('2e0c766a-6097-4cd9-b13f-a957697a060a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'c8a27d18-898a-46c7-9be1-666344cccc51');
INSERT INTO `sys_role_permission` VALUES ('30620833-2f79-4451-b402-629810c0f49a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '6a5aee9a-2739-429f-83db-ebd2ec656205');
INSERT INTO `sys_role_permission` VALUES ('308b2b91-5d7d-40ac-8526-b1023cbed2d4', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '636423f6-0657-412a-951a-80caa3930f21');
INSERT INTO `sys_role_permission` VALUES ('3989e12d-d5a2-4d1b-ac21-6b479da5a23a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a3c5c8ec-69ca-4c0f-b6a0-27d11f81775b');
INSERT INTO `sys_role_permission` VALUES ('3a240dfc-3d1d-4a88-83d7-ce9ef0cb8ae0', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '6d304bad-996b-40d5-a43a-7bab9ead2744');
INSERT INTO `sys_role_permission` VALUES ('3b9e0a6b-f4fe-4ae3-bcc0-c65faf37f2fe', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '31292492-7a02-446c-b509-6ad4884beb0');
INSERT INTO `sys_role_permission` VALUES ('41b935ca-5f95-453c-8e8d-8b0ea6f59a14', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f7a3c83a-d4b6-4776-9c99-ca6ccc005004');
INSERT INTO `sys_role_permission` VALUES ('507af871-b50d-47f5-80fe-0dc4c681744c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4365dca5-ba7b-4233-92d7-f31fdb01aaa8');
INSERT INTO `sys_role_permission` VALUES ('582de2d6-24ff-4797-bf04-42f4e39ab4ec', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb');
INSERT INTO `sys_role_permission` VALUES ('59eff7eb-4d13-45bb-8977-1e419a32c968', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10dd853b-9272-4cd6-93bc-4a03bab7a18f');
INSERT INTO `sys_role_permission` VALUES ('601ab156-c314-4c66-af87-c5e326ecb3c6', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '484a14c2-82f9-4818-afd9-959ddccc5a96');
INSERT INTO `sys_role_permission` VALUES ('61a66dea-32c8-4435-9d34-49e36de47d86', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a27048fe-6403-4234-97a9-545fc67b9d81');
INSERT INTO `sys_role_permission` VALUES ('62a69797-114c-4c15-bbe3-a696af5c517e', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5');
INSERT INTO `sys_role_permission` VALUES ('695042ce-7dc5-4bb0-9615-6cb525f6d3ce', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ef2db655-1acb-4aed-bbe6-0c12020d0562');
INSERT INTO `sys_role_permission` VALUES ('6cfec3e7-12c3-4d85-b1e4-92924ee04869', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7');
INSERT INTO `sys_role_permission` VALUES ('6f9091f4-9423-4608-82db-94d833a0960d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b4fcdfa1-cb03-4afe-bad3-b2ad7d3f12b7');
INSERT INTO `sys_role_permission` VALUES ('74502ec0-4efa-40f2-a2a8-5511277a927b', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '2b552e47-8a30-4ecc-a183-797e85db8ef5');
INSERT INTO `sys_role_permission` VALUES ('753b14aa-af20-4063-88c0-34fe5b0192af', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f8a16ae2-78ea-4be6-85d7-2c02b76ea9ab');
INSERT INTO `sys_role_permission` VALUES ('768eb7af-eb83-40c4-9611-2ae6437e8c1f', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206');
INSERT INTO `sys_role_permission` VALUES ('7c7f0484-6912-4f93-85e4-126334d8d515', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '887460aa-df2c-47e3-bb13-116aec0fcd25');
INSERT INTO `sys_role_permission` VALUES ('86a081ee-fb7d-4397-925c-b26e9fed6914', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '66a7e4f0-46ad-4642-b348-0c85ee5860af');
INSERT INTO `sys_role_permission` VALUES ('8993920f-b565-4b4e-bd59-6dc9cf69c20c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '6d304bad-996b-40d5-a43a-7bab9ead2744');
INSERT INTO `sys_role_permission` VALUES ('8d2028c0-1f22-4b14-ad08-4ec741903314', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '2531bbd4-f502-4818-af8c-d545e225547d');
INSERT INTO `sys_role_permission` VALUES ('8e4dc413-1902-4818-abac-070c64bf1e3b', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '250b7a06-2dbb-4c76-b483-1bd3542f1b99');
INSERT INTO `sys_role_permission` VALUES ('970cd538-4c0d-4b68-8ad6-d988345a5df8', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10417cf5-f095-4abd-a9f0-5e8e8bcafb3c');
INSERT INTO `sys_role_permission` VALUES ('9e532802-5b07-4aee-bd04-6e869766c561', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '8d8814dc-e3ce-426c-8188-67c2dba77f72');
INSERT INTO `sys_role_permission` VALUES ('a2671000-cf40-48d8-bc30-38f74ecc58bb', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ef2db655-1acb-4aed-bbe6-0c12020d0562');
INSERT INTO `sys_role_permission` VALUES ('a9191104-02a1-46dd-9d3a-030f22a2d473', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'c9b7eb18-db9d-4935-846e-32c93407905a');
INSERT INTO `sys_role_permission` VALUES ('ad0e6f15-6f2b-4cb5-aa7b-3d6469af2a6d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4313ded5-ee99-49cb-88fd-44b70dc0bef1');
INSERT INTO `sys_role_permission` VALUES ('b95c704e-920e-4fc5-bfb1-b8e7695248d6', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '98af51d3-573b-4b3b-822e-df44ba01be91');
INSERT INTO `sys_role_permission` VALUES ('bc46757a-6a15-488f-a134-123c6a49585c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'ba3334a6-d382-4fc9-8e40-6f4f134d2206');
INSERT INTO `sys_role_permission` VALUES ('bc635f9f-f8e9-4d3f-9eb8-b72d3de995ea', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '676cec2a-d9ff-4961-9213-499369b1c902');
INSERT INTO `sys_role_permission` VALUES ('bf94ea61-0757-4670-a613-c78d8c439a67', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4d4a312c-7046-4872-9efb-18af351296d5');
INSERT INTO `sys_role_permission` VALUES ('c48f0448-89da-4a47-9773-6cb124b2c60d', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '10ba71b0-69ba-402c-b19b-6d2ec4c8018a');
INSERT INTO `sys_role_permission` VALUES ('c8f63da6-5d5d-40af-84ca-f12fe0257149', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '78f4e162-3cb2-4ac9-ab1e-3e4e7d9e27bb');
INSERT INTO `sys_role_permission` VALUES ('ca26307d-7748-4c40-9b94-b75f70849895', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b2f8ef54-dc2a-47fe-8e88-fa025866bcfe');
INSERT INTO `sys_role_permission` VALUES ('cce08084-2581-4f5f-9b92-e8ce51b314c8', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '969dcc20-b24f-4fd4-be01-141e294bd14e');
INSERT INTO `sys_role_permission` VALUES ('d34270a7-4480-43d9-903a-873f407d79f1', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '843528e7-3a86-4b12-b433-f93bcccbc7e7');
INSERT INTO `sys_role_permission` VALUES ('d4cbc5f9-778e-4fd2-a6fa-d24d57d1d897', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a52040ca-ded7-4ca3-b94c-b492871d25fb');
INSERT INTO `sys_role_permission` VALUES ('d92761db-12aa-4649-afe4-eb123fe5758a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'b9b8e480-1a2b-409b-918a-c5969e65d900');
INSERT INTO `sys_role_permission` VALUES ('d9c75171-153b-447f-a3ef-825e00a558a8', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'a0526cc2-26b4-4588-b822-e48643a58583');
INSERT INTO `sys_role_permission` VALUES ('dc61677e-03b1-4a09-ba88-79d188262984', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '06953b13-d8d0-493e-a630-792ddcacfef5');
INSERT INTO `sys_role_permission` VALUES ('de8153bc-cf3a-4dd3-a5ac-96c6ac27dc29', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '06953b13-d8d0-493e-a630-792ddcacfef5');
INSERT INTO `sys_role_permission` VALUES ('e542f4bd-8ce6-48d8-84d4-f8180a45c834', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '306e4a38-9e71-4e77-b66d-4aab6a0d94e5');
INSERT INTO `sys_role_permission` VALUES ('e566ada5-4d8c-429b-921e-8d0b1a0ecaa1', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'd6cdc6a9-f040-4dfa-9d68-2e0c15eafcd9');
INSERT INTO `sys_role_permission` VALUES ('eb954fdf-4f9d-4a20-acc1-5ae30f52fa81', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'f25c0cb5-8c15-4569-8c24-32a60c3c07a0');
INSERT INTO `sys_role_permission` VALUES ('ecfcc8e7-90ab-40ba-accb-08d500b5e03f', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', 'e7c705cb-c734-4160-b5bd-b15bf022dbe6');
INSERT INTO `sys_role_permission` VALUES ('ed43b14f-46b5-4fde-b10b-d49b99b8345c', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb');
INSERT INTO `sys_role_permission` VALUES ('edd80665-8866-4f5e-95d5-461581bbbc8a', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '3abf143e-9da9-4750-9c4f-d01cc02ac4f5');
INSERT INTO `sys_role_permission` VALUES ('f7feda3e-3c99-4dfb-867b-95c519fcdd53', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '4313ded5-ee99-49cb-88fd-44b70dc0bef1');
INSERT INTO `sys_role_permission` VALUES ('fff137b6-1bb7-41d6-8fbc-87461ec182a0', 'cf555eea-98ce-4d83-a5f1-544d3c1d37ab', '0ff30de5-3ccd-40f0-bdbb-3a547a2c27fb');

-- ----------------------------
-- Table structure for sys_topic
-- ----------------------------
DROP TABLE IF EXISTS `sys_topic`;
CREATE TABLE `sys_topic` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `topicId` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '主题 id',
  `topicType` tinyint(4) NOT NULL COMMENT '主题类型',
  `content` text COLLATE utf8_unicode_ci NOT NULL COMMENT '评论内容',
  `fromUid` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT '评论用户 id',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_topic
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `userName` varchar(50) COLLATE utf8_unicode_ci NOT NULL COMMENT '名称',
  `userPwd` varchar(100) COLLATE utf8_unicode_ci NOT NULL COMMENT '密码',
  `userType` tinyint(4) NOT NULL DEFAULT '0' COMMENT '用户类型（0：普通用户；1：管理员；2：超级管理员；）',
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '姓名',
  `mobile` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '手机号',
  `email` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '邮箱',
  `sex` tinyint(4) DEFAULT '0' COMMENT '性别（0：保密；1：男；2：女）',
  `birthday` date DEFAULT NULL COMMENT '生日',
  `loginTime` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `loginCount` int(11) DEFAULT '0' COMMENT '登录次数',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_f6a2048fab3882df93b31edfa2` (`userName`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('518e81b2-0bda-4729-be21-d25c94a424ff', '1', null, '2021-08-07 00:40:19.358524', null, '2021-08-07 10:44:53.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, 'wangyue', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', '2', '王月', '15172501111', '15172501111@qq.com', '0', null, '2021-08-07 10:44:53', '0');
INSERT INTO `sys_user` VALUES ('a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98', '1', null, '2021-08-06 23:22:01.374500', null, '2021-08-07 10:51:03.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, 'chengmz', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', '2', '小卓', null, null, '0', null, '2021-08-07 10:51:03', '0');
INSERT INTO `sys_user` VALUES ('d42d636b-cd41-4514-88e8-97ce499d4c32', '1', null, '2021-08-06 23:19:53.818955', null, '2021-08-07 10:51:31.000000', '518e81b2-0bda-4729-be21-d25c94a424ff', '0', null, null, 'wangy', '92925488b28ab12584ac8fcaa8a27a0f497b2c62940c8f4fbc8ef19ebc87c43e', '2', '王月', null, null, '0', null, '2021-08-07 10:51:31', '0');

-- ----------------------------
-- Table structure for sys_userinfo
-- ----------------------------
DROP TABLE IF EXISTS `sys_userinfo`;
CREATE TABLE `sys_userinfo` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `provinceId` int(11) DEFAULT NULL COMMENT '省份',
  `cityId` int(11) DEFAULT NULL COMMENT '城市',
  `districtId` int(11) DEFAULT NULL COMMENT '区/县',
  `address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `userId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_30c0bea662a051d2b8d548c3fb` (`userId`),
  CONSTRAINT `FK_30c0bea662a051d2b8d548c3fbe` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_userinfo
-- ----------------------------
INSERT INTO `sys_userinfo` VALUES ('3ee10b75-e9b2-4dc1-9f96-7d2e000098b0', '1681', '1726', '1728', null, 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98');
INSERT INTO `sys_userinfo` VALUES ('79e4686b-b1b8-4339-bcee-2032b225a0a2', '1681', '1726', '1727', null, 'd42d636b-cd41-4514-88e8-97ce499d4c32');
INSERT INTO `sys_userinfo` VALUES ('7aac100e-9e4a-44e5-ab1e-2e06b0cd76b2', '1681', '1682', '1689', '关东街道曙光星城', '518e81b2-0bda-4729-be21-d25c94a424ff');

-- ----------------------------
-- Table structure for sys_user_address
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_address`;
CREATE TABLE `sys_user_address` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态（0：禁用；1：启用）',
  `description` text COLLATE utf8_unicode_ci COMMENT '描述',
  `createTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '创建时间',
  `createBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '创建人 id',
  `updateTime` datetime(6) DEFAULT CURRENT_TIMESTAMP(6) COMMENT '最后更新时间',
  `updateBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '修改人 id',
  `deleteStatus` tinyint(4) NOT NULL DEFAULT '0' COMMENT '删除状态（0：未删除；1：删除）',
  `deleteTime` datetime(6) DEFAULT NULL COMMENT '删除时间',
  `deleteBy` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '删除人 id',
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '姓名',
  `mobile` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '手机号',
  `sex` tinyint(4) DEFAULT '0' COMMENT '性别（0：保密；1：男；2：女）',
  `provinceId` int(11) DEFAULT NULL COMMENT '省份',
  `cityId` int(11) DEFAULT NULL COMMENT '城市',
  `districtId` int(11) DEFAULT NULL COMMENT '区/县',
  `address` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '详细地址',
  `userId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  UNIQUE KEY `REL_18ae11f917ae18ab46bb1e1781` (`userId`),
  CONSTRAINT `FK_18ae11f917ae18ab46bb1e17816` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_user_address
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_group
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_group`;
CREATE TABLE `sys_user_group` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `userId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  `groupId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  KEY `FK_f92a05dbbb9215840ac2e7d4519` (`userId`),
  KEY `FK_6cf060e653685eda54fb44af8d4` (`groupId`),
  CONSTRAINT `FK_6cf060e653685eda54fb44af8d4` FOREIGN KEY (`groupId`) REFERENCES `sys_group` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_f92a05dbbb9215840ac2e7d4519` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_user_group
-- ----------------------------
INSERT INTO `sys_user_group` VALUES ('148dc66f-0c0e-47b6-80a9-2d6837577645', 'a2fdfeb4-9a1a-41ce-b1c9-c8f81b510a98', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('537c5612-8dd2-4e70-bdeb-611137a6fe6b', 'd42d636b-cd41-4514-88e8-97ce499d4c32', '0950c980-ab23-4244-8e0f-ce70e9628e13');
INSERT INTO `sys_user_group` VALUES ('b499f632-dd40-4997-8492-0f1c7f91d0e2', '518e81b2-0bda-4729-be21-d25c94a424ff', '0950c980-ab23-4244-8e0f-ce70e9628e13');

-- ----------------------------
-- Table structure for sys_user_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_role`;
CREATE TABLE `sys_user_role` (
  `id` varchar(36) COLLATE utf8_unicode_ci NOT NULL COMMENT '主键 id',
  `userId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  `roleId` varchar(36) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '主键 id',
  PRIMARY KEY (`id`),
  KEY `FK_3c879483a655a9387b8c4876085` (`userId`),
  KEY `FK_3ec9b31612c830bf0221b9e7f36` (`roleId`),
  CONSTRAINT `FK_3c879483a655a9387b8c4876085` FOREIGN KEY (`userId`) REFERENCES `sys_user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_3ec9b31612c830bf0221b9e7f36` FOREIGN KEY (`roleId`) REFERENCES `sys_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sys_user_role
-- ----------------------------
