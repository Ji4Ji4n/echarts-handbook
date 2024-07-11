(window.webpackJsonp=window.webpackJsonp||[]).push([[112],{410:function(n,t,e){"use strict";e.r(t),t.default="# 跨系列的全局过渡动画\n\n在[基础的过渡动画](${lang}/how-to/animation/transition)一文中我们介绍了在同一个系列中添加，修改以及移除数据的时候所应用的过渡动画，绝大部分场景下，这些基础的过渡动画效果已经满足我们的诉求，可以很好的表达数据的变化。\n\n有时候我们也会碰到更加复杂的需求，例如想要从一个表达数据对比的柱状图切换成表达数据占比比的饼图，或者想要将多个系列的散点图分布聚合成这几个系列的统计值对比的柱状图等等。在之前我们面对这些需求往往只能放弃动画效果采用直接切换的方式。在 5.2.0 中我们引入了全局过渡动画（Universal Transition）来满足这些更复杂的动画需求。\n\n全局过渡动画可以在切换系列类型的时候通过变形动画过渡，而不是生硬的直接切换。而且可以应用过渡动画的属性也更加丰富，包含了颜色，描边，不透明度等等的样式。\n\n下面是一个基础的柱状图和饼图之间变形过渡的例子：\n\n```js live {layout: 'bt'}\nconst dataset = {\n  dimensions: ['name', 'score'],\n  source: [\n    ['Hannah Krause', 314],\n    ['Zhao Qian', 351],\n    ['Jasmin Krause ', 287],\n    ['Li Lei', 219],\n    ['Karle Neumann', 253],\n    ['Mia Neumann', 165],\n    ['Böhm Fuchs', 318],\n    ['Han Meimei', 366]\n  ]\n};\nconst pieOption = {\n  dataset: [dataset],\n  series: [\n    {\n      type: 'pie',\n      // 通过 id 关联需要过渡动画的系列\n      id: 'Score',\n      radius: [0, '50%'],\n      universalTransition: true,\n      animationDurationUpdate: 1000\n    }\n  ]\n};\nconst barOption = {\n  dataset: [dataset],\n  xAxis: {\n    type: 'category'\n  },\n  yAxis: {},\n  series: [\n    {\n      type: 'bar',\n      // 通过 id 关联需要过渡动画的系列\n      id: 'Score',\n      // 每个数据都是用不同的颜色\n      colorBy: 'data',\n      encode: { x: 'name', y: 'score' },\n      universalTransition: true,\n      animationDurationUpdate: 1000\n    }\n  ]\n};\n\noption = barOption;\n\nsetInterval(() => {\n  option = option === pieOption ? barOption : pieOption;\n  // 使用 notMerge 的形式可以移除坐标轴\n  myChart.setOption(option, true);\n}, 2000);\n```\n\n## 跨系列的形变动画\n\n如上面例子所示，全局过渡动画最常见的一个应用场景就是切换系列类型时实现跨系列的过渡动画。\n\n基础的过渡动画会被应用于同一系列中的数据更新，而如何决定同一系列有两个因素，一个是`type`即系列的类型，还有一个是`name`即系列的名字（如果没有传入`name`则会默认使用`seriesIndex`），这两个组合在一起决定了更新前后是否是同一个系列。\n\n对于跨系列的过渡动画，系列类型已经改变了，我们就需要一个额外的标志来对应前后是否是同一个系列以及是否要应用过渡动画，这个标志就是`id`。\n\n因此我们首先要保证更新的时候给需要动画的系列都指定了唯一的`id`：\n\n```ts\nchart.setOption({\n  series: [\n    {\n      type: 'bar',\n      id: 'Main'\n      //...\n    }\n  ]\n});\n//...\nchart.setOption({\n  series: [\n    {\n      type: 'pie',\n      id: 'Main'\n      //...\n    }\n  ]\n});\n```\n\n然后我们通过`universalTransition`配置项开启全局过渡动画功能，\n\n```ts\nchart.setOption({\n  series: [\n    {\n      type: 'pie',\n      id: 'Main',\n      universalTransition: true\n      //...\n    }\n  ]\n});\n```\n\n开启后如上面例子演示的一样，ECharts 会从柱状图中使用的矩形采用最合适的方式形变成饼图中所使用的扇形。\n\n我们简单介绍一下这中间发生了什么：\n\n1. 在第二次 setOption 后，ECharts 会找到前后两个系列中数据的对应关系，分别执行入场动画，更新动画和移除动画\n\n> 跟基础的过渡动画一样，全局过渡动画也会根据数据的`name`属性进行数据的比对，从而相应的入场，更新和出场动画。\n\n2. 对于入场动画和移除动画，ECharts 会应用默认的淡入淡出动画\n3. 对于更新动画，因为图形的形状已经发生了改变，所以为了能够进行插值动画，ECharts 会先将两个不同的图形路径（矩形和扇形）分别转成贝塞尔曲线集合，进行对齐旋转等操作，从而可以以最自然的方式变形。在动画过程中这些路径都会被绘制成中间态的贝塞尔曲线\n4. 动画完成后继续使用默认的方式绘制。\n\n因此只要前后能够找到对应的数据，不管是什么系列，ECharts 都能够使用形变动画过渡。这是一套通用的方案，并不会有系列类型上的限制。\n\n我们可以在柱状图，饼图，散点图等常规的系列之间变形过渡：\n\n![](images/5-2-0/universal-transition.gif)\n\n在更复杂的柱状图和地图之间:\n\n![](images/5-2-0/universal-transition-2.gif)\n\n或者旭日图和矩形树图之间，甚至非常灵活的自定义系列之间都可以进行动画的过渡。\n\n![](images/5-2-0/universal-transition-3.gif)\n\n## Symbol 的形变动画\n\n除了跨系列过渡动画，对于散点图（scatter），象形柱图（pictorialBar）等图表，还会因为使用不同的`symbol`配置导致图形类型发生改变，在引入全局过渡动画之后，`symbol`的改变也可以实现变形的过渡。\n\n```ts\nchart.setOption({\n  series: {\n    type: 'scatter',\n    symbol: 'rect'\n  }\n});\n// 切换成圆形\nchart.setOption({\n  series: {\n    type: 'scatter',\n    symbol: 'circle',\n    universalTransition: true\n  }\n});\n```\n\n> 在这种情况下，因为是同一个系列内的动画过渡，所以我们不需要像上面跨系列一样指定 id 了。\n\n下面例子演示了不同类型的`symbol`形变的效果。\n\n```ts live { layout: 'bt' }\nlet xData = [];\nlet yData = [];\nlet data = [];\nfor (let y = 0; y < 5; y++) {\n  yData.push(y);\n  for (let x = 0; x < 5; x++) {\n    data.push([x, y, 5]);\n  }\n}\nfor (let x = 0; x < 5; x++) {\n  xData.push(x);\n}\nconst options = [\n  {\n    grid: {\n      left: 0,\n      right: 0,\n      top: 0,\n      bottom: 0\n    },\n    xAxis: {\n      show: false,\n      type: 'category',\n      data: xData\n    },\n    yAxis: {\n      show: false,\n      type: 'category',\n      data: yData\n    },\n    series: [\n      {\n        type: 'scatter',\n        data: data,\n        symbol: 'roundRect',\n        symbolKeepAspect: true,\n        universalTransition: true,\n        symbolSize: 50\n      }\n    ]\n  },\n  {\n    series: [\n      {\n        type: 'scatter',\n        symbol: 'circle'\n      }\n    ]\n  },\n  {\n    // heart\n    series: [\n      {\n        symbol:\n          'path://M23.6 2c-3.363 0-6.258 2.736-7.599 5.594-1.342-2.858-4.237-5.594-7.601-5.594-4.637 0-8.4 3.764-8.4 8.401 0 9.433 9.516 11.906 16.001 21.232 6.13-9.268 15.999-12.1 15.999-21.232 0-4.637-3.763-8.401-8.4-8.401z'\n      }\n    ]\n  },\n  {\n    // happy\n    series: [\n      {\n        symbol:\n          'path://M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM22 8c1.105 0 2 1.343 2 3s-0.895 3-2 3-2-1.343-2-3 0.895-3 2-3zM10 8c1.105 0 2 1.343 2 3s-0.895 3-2 3-2-1.343-2-3 0.895-3 2-3zM16 28c-5.215 0-9.544-4.371-10-9.947 2.93 1.691 6.377 2.658 10 2.658s7.070-0.963 10-2.654c-0.455 5.576-4.785 9.942-10 9.942z'\n      }\n    ]\n  },\n  {\n    // evil\n    series: [\n      {\n        symbol:\n          'path://M32 2c0-1.422-0.298-2.775-0.833-4-1.049 2.401-3.014 4.31-5.453 5.287-2.694-2.061-6.061-3.287-9.714-3.287s-7.021 1.226-9.714 3.287c-2.439-0.976-4.404-2.886-5.453-5.287-0.535 1.225-0.833 2.578-0.833 4 0 2.299 0.777 4.417 2.081 6.106-1.324 2.329-2.081 5.023-2.081 7.894 0 8.837 7.163 16 16 16s16-7.163 16-16c0-2.871-0.757-5.565-2.081-7.894 1.304-1.689 2.081-3.806 2.081-6.106zM18.003 11.891c0.064-1.483 1.413-2.467 2.55-3.036 1.086-0.543 2.16-0.814 2.205-0.826 0.536-0.134 1.079 0.192 1.213 0.728s-0.192 1.079-0.728 1.213c-0.551 0.139-1.204 0.379-1.779 0.667 0.333 0.357 0.537 0.836 0.537 1.363 0 1.105-0.895 2-2 2s-2-0.895-2-2c0-0.037 0.001-0.073 0.003-0.109zM8.030 8.758c0.134-0.536 0.677-0.862 1.213-0.728 0.045 0.011 1.119 0.283 2.205 0.826 1.137 0.569 2.486 1.553 2.55 3.036 0.002 0.036 0.003 0.072 0.003 0.109 0 1.105-0.895 2-2 2s-2-0.895-2-2c0-0.527 0.204-1.005 0.537-1.363-0.575-0.288-1.228-0.528-1.779-0.667-0.536-0.134-0.861-0.677-0.728-1.213zM16 26c-3.641 0-6.827-1.946-8.576-4.855l2.573-1.544c1.224 2.036 3.454 3.398 6.003 3.398s4.779-1.362 6.003-3.398l2.573 1.544c-1.749 2.908-4.935 4.855-8.576 4.855z'\n      }\n    ]\n  },\n  {\n    // hipster\n    series: [\n      {\n        symbol:\n          'path://M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM22 8c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2zM10 8c1.105 0 2 0.895 2 2s-0.895 2-2 2-2-0.895-2-2 0.895-2 2-2zM16.994 21.23c-0.039-0.035-0.078-0.072-0.115-0.109-0.586-0.586-0.878-1.353-0.879-2.121-0 0.768-0.293 1.535-0.879 2.121-0.038 0.038-0.076 0.074-0.115 0.109-2.704 2.453-9.006-0.058-9.006-3.23 1.938 1.25 3.452 0.306 4.879-1.121 1.172-1.172 3.071-1.172 4.243 0 0.586 0.586 0.879 1.353 0.879 2.121 0-0.768 0.293-1.535 0.879-2.121 1.172-1.172 3.071-1.172 4.243 0 1.427 1.427 2.941 2.371 4.879 1.121 0 3.173-6.302 5.684-9.006 3.23z'\n      }\n    ]\n  },\n  {\n    // shocked\n    series: [\n      {\n        symbol:\n          'path://M16 0c-8.837 0-16 7.163-16 16s7.163 16 16 16 16-7.163 16-16-7.163-16-16-16zM10 14c-1.105 0-2-1.343-2-3s0.895-3 2-3 2 1.343 2 3-0.895 3-2 3zM16 26c-2.209 0-4-1.791-4-4s1.791-4 4-4c2.209 0 4 1.791 4 4s-1.791 4-4 4zM22 14c-1.105 0-2-1.343-2-3s0.895-3 2-3 2 1.343 2 3-0.895 3-2 3z'\n      }\n    ]\n  },\n  {\n    // pie chart\n    series: [\n      {\n        symbol:\n          'path://M14 18v-14c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14c0-2.251-0.532-4.378-1.476-6.262l-12.524 6.262zM28.524 7.738c-2.299-4.588-7.043-7.738-12.524-7.738v14l12.524-6.262z'\n      }\n    ]\n  },\n  {\n    // users\n    series: [\n      {\n        symbol:\n          'path://M10.225 24.854c1.728-1.13 3.877-1.989 6.243-2.513-0.47-0.556-0.897-1.176-1.265-1.844-0.95-1.726-1.453-3.627-1.453-5.497 0-2.689 0-5.228 0.956-7.305 0.928-2.016 2.598-3.265 4.976-3.734-0.529-2.39-1.936-3.961-5.682-3.961-6 0-6 4.029-6 9 0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h8.719c0.454-0.403 0.956-0.787 1.506-1.146zM24 24.082v-1.649c2.203-1.241 4-4.337 4-7.432 0-4.971 0-9-6-9s-6 4.029-6 9c0 3.096 1.797 6.191 4 7.432v1.649c-6.784 0.555-12 3.888-12 7.918h28c0-4.030-5.216-7.364-12-7.918z'\n      }\n    ]\n  },\n  {\n    // mug\n    series: [\n      {\n        symbol:\n          'path://M30 10h-6v-3c0-2.761-5.373-5-12-5s-12 2.239-12 5v20c0 2.761 5.373 5 12 5s12-2.239 12-5v-3h6c1.105 0 2-0.895 2-2v-10c0-1.105-0.895-2-2-2zM5.502 8.075c-1.156-0.381-1.857-0.789-2.232-1.075 0.375-0.286 1.075-0.694 2.232-1.075 1.811-0.597 4.118-0.925 6.498-0.925s4.688 0.329 6.498 0.925c1.156 0.381 1.857 0.789 2.232 1.075-0.375 0.286-1.076 0.694-2.232 1.075-1.811 0.597-4.118 0.925-6.498 0.925s-4.688-0.329-6.498-0.925zM28 20h-4v-6h4v6z'\n      }\n    ]\n  },\n  {\n    // plane\n    series: [\n      {\n        symbol:\n          'path://M24 19.999l-5.713-5.713 13.713-10.286-4-4-17.141 6.858-5.397-5.397c-1.556-1.556-3.728-1.928-4.828-0.828s-0.727 3.273 0.828 4.828l5.396 5.396-6.858 17.143 4 4 10.287-13.715 5.713 5.713v7.999h4l2-6 6-2v-4l-7.999 0z'\n      }\n    ]\n  }\n];\nlet optionIndex = 0;\noption = options[optionIndex];\nsetInterval(function() {\n  optionIndex = (optionIndex + 1) % options.length;\n  myChart.setOption(options[optionIndex]);\n}, 700);\n```\n\n\x3c!--\n## 多对多映射\n\n上面我们介绍的都是在数据更新时一对一的过渡动画，有时候我们的更新是对数据的聚合或者下钻，并不是一对一的，这个时候我们可以采用合并或者分割的动画来表现数据的聚合和下钻效果。\n\n### 数据聚合\n\nECharts 的统计插件 [echarts-stat](https://github.com/ecomfe/echarts-stat) 提供了一些常用的聚合方法，\n\n### 数据下钻\n\n### 如何分割图形 --\x3e\n"}}]);