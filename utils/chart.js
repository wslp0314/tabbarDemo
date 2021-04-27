
module.exports = {
  draw: init,
  saveCanvans: saveCanvans
}
const app = getApp();


var util = require("chartUtils.js");
var canvasId = '';
var pageObj = null;
var chartOpt = {
  chartPieCount: 0,
  hideXYaxis: false,
  axisMark: [],
  barLength: 0,
  barNum: 0,
  // bgColor: "transparent",
  lineColor: "#c2c2c2",
  bgColor: "#ffffff",
  chartWidth: 0,
  chartHeight: 0,
  legendWidth: 0,
  legendHeight: 0,
  chartSpace: 10,
  textSpace: 5,
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  axisLeft: 0,
  axisBottom: 0,
  axisTop: 0
}
var dataSet = {
  hideYaxis: false,
  title: {
    color: "#394655",
    size: 16,
    text: ""
  },
  legend: {
    color: "",
    size: 12
  },
  color: ['#74DAE5', '#394655', '#FEE746', '#B9A39B', '#C18734', '#9EC3AD', '#6D9BA3', '#7E9C82', '#DAEE59', '#CFDCED'],
  xAxis: {
    color: "#666A73",
    size: 10,
    data: []
  },
  series: [
    {
      name: "",
      category: "bar",
      data: []
    },
    {
      name: "",
      category: "line",
      data: []
    }
  ]
}

function init(page, canvas, data) {
  canvasId = canvas;
  pageObj = page;
  checkData(data);

  var ctx = initCanvas(page, canvasId);
  drawChart(ctx);
}
/**
 * 初始化Canvas
 */
function initCanvas(page, canvasId) {
  var ctx = wx.createCanvasContext(canvasId);
  var Sys = wx.getSystemInfoSync();

  chartOpt.chartWidth = Sys.windowWidth;
  if (          app.globalData.hidePie    ) {
    chartOpt.chartHeight = 0;
  } else {
    chartOpt.chartHeight = Sys.windowWidth * 0.6;//Canvas组件的宽高比
  }

  chartOpt.legendWidth = dataSet.legend.size * 1.3;
  chartOpt.legendHeight = dataSet.legend.size * 0.8;

  chartOpt.top = chartOpt.left = chartOpt.chartSpace;
  chartOpt.right = chartOpt.chartWidth - chartOpt.chartSpace;
  chartOpt.bottom = chartOpt.chartHeight - chartOpt.chartSpace;

  //3个数字的文字长度
  var textWidth = util.mesureText('100', dataSet.xAxis.size);
  var legendHeight = dataSet.series.length > 1 ? (chartOpt.legendHeight + chartOpt.chartSpace * 2) : 0;

  chartOpt.axisLeft = chartOpt.left + (dataSet.hideYaxis ? 0 : textWidth + chartOpt.textSpace);
  chartOpt.axisBottom = chartOpt.bottom - dataSet.xAxis.size - chartOpt.textSpace - legendHeight;
  chartOpt.axisTop = chartOpt.top + dataSet.title.size + chartOpt.textSpace + dataSet.xAxis.size * 2;
  chartOpt.axisTop = 0;


  //更新页面Canvas的宽度、高度
  page.setData({
    chartWidth: chartOpt.chartWidth,
    chartHeight: chartOpt.chartHeight
  });

  return ctx;
}
/**
 * 检查并更新图表数据
 */
function checkData(data) {

  if (data.title != undefined) {
    if (data.title.color != undefined && data.title.color != '') {
      dataSet.title.color = data.title.color;
    }
    dataSet.title.text = data.title.text;

  }
  if (data.color != undefined && data.color != [] && data.color.length > 0) {
    dataSet.color = data.color;
  }
  dataSet.xAxis.data = data.xAxis.data;


  dataSet.series = data.series;

  var value = new Array();
  chartOpt.chartPieCount = 0;
  for (var i = 0; i < dataSet.series.length; i++) {
    var item = dataSet.series[i];
    var itemLenght = item.data.length;
    if (itemLenght > chartOpt.barLength) {
      chartOpt.barLength = itemLenght;
    }
    for (var k = 0; k < itemLenght; k++) {
      value.push(item.data[k]);
    }
    if (item.category == 'bar') {
      chartOpt.barNum += 1;

    }
    if (item.category == 'pie') {
      chartOpt.hideXYaxis = true;
      for (var k = 0; k < itemLenght; k++) {
        chartOpt.chartPieCount += item.data[k];
      }
    }

  }

  var minNum = Math.min.apply(null, value);
  var maxNum = Math.max.apply(null, value);
  //计算Y轴刻度尺数据
  chartOpt.axisMark = util.calculateY(minNum, maxNum, 5);
}
/**
 * 绘制图表
 */
function drawChart(ctx) {
  drawBackground(ctx);
  drawTitle(ctx);
  drawLegend(ctx);
  if (!chartOpt.hideXYaxis) {
    drawXaxis(ctx);
    drawYaxis(ctx);
  }

  // drawBarChart(ctx);
  drawCharts(ctx);
  ctx.draw();
}
/**
 * 绘制图表背景
 */
function drawBackground(ctx) {
  if (chartOpt.bgColor != "" && chartOpt.bgColor != "transparent") {
    ctx.setFillStyle(chartOpt.bgColor);
    ctx.fillRect(0, 0, chartOpt.chartWidth, chartOpt.chartHeight);
  }
}
/**
 * 绘制标题
 */
function drawTitle(ctx) {
  var title = dataSet.title;
  if (title.text != '') {

    var textWidth = util.mesureText(title.text, title.size);
    ctx.setFillStyle(title.color);
    ctx.setFontSize(title.size)
    ctx.setTextAlign('left');
    ctx.fillText(title.text, (chartOpt.chartWidth - textWidth) / 2, chartOpt.top + title.size);
  }

}
/**
 * 绘制X轴刻度尺
 */
function drawXaxis(ctx) {
  //绘制X轴横线
  ctx.setLineWidth(0.5);
  ctx.setLineCap('round');
  ctx.moveTo(chartOpt.axisLeft, chartOpt.axisBottom)
  ctx.lineTo(chartOpt.right, chartOpt.axisBottom)
  ctx.stroke();


  var width = (chartOpt.right - chartOpt.axisLeft) / chartOpt.barLength;
  var data = dataSet.xAxis.data;
  //绘制X轴显示文字
  for (var i = 0; i < data.length; i++) {
    var textX = (width * (i + 1)) - (width / 2) + chartOpt.axisLeft;
    ctx.setFillStyle(dataSet.xAxis.color);
    ctx.setFontSize(dataSet.xAxis.size);
    ctx.setTextAlign('center');
    ctx.fillText(data[i], textX, chartOpt.axisBottom + dataSet.xAxis.size + chartOpt.textSpace);
  }
}
/**
 * 绘制Y轴刻度尺
 */
function drawYaxis(ctx) {

  //绘制Y轴横线
  ctx.setLineWidth(0.5);
  ctx.setLineCap('round');

  var height = (chartOpt.axisBottom - chartOpt.axisTop) / (chartOpt.axisMark.length - 1);
  //绘制Y轴显示数字
  for (var i = 0; i < chartOpt.axisMark.length; i++) {
    var y = chartOpt.axisBottom - height * i;
    if (i > 0) {
      ctx.setStrokeStyle(chartOpt.lineColor);
      util.drawDashLine(ctx, chartOpt.axisLeft, y, chartOpt.right, y);
    }

    if (!dataSet.hideYaxis) {
      ctx.setFillStyle(dataSet.xAxis.color);
      ctx.setFontSize(dataSet.xAxis.size)
      ctx.setTextAlign('right');
      ctx.fillText(chartOpt.axisMark[i], chartOpt.axisLeft - chartOpt.textSpace, y + chartOpt.textSpace);
    }
  }
}

/**
 * 绘制图例
 */
function drawLegend(ctx) {
  var series = dataSet.series;

  for (var i = 0; i < series.length; i++) {
    var names = series[i].name;
    var isPie = series[i].category == 'pie';
    var textWidth = util.mesureText(isPie?names[0]:names, dataSet.xAxis.size);
    var legendWidth = chartOpt.legendWidth + textWidth + chartOpt.chartSpace * 2;
    var startX = (chartOpt.chartWidth / 2) - (legendWidth * (isPie ?names.length:series.length)) / 2;

    if (series[i].category == 'pie') {
      for (var k = 0; k < names.length; k++) {
        var x = startX + legendWidth * k;
        var y = chartOpt.bottom - chartOpt.legendHeight;

        ctx.setFillStyle(dataSet.xAxis.color);
        ctx.setFontSize(dataSet.legend.size)
        ctx.setTextAlign('left');
        ctx.fillText(names[k], x + chartOpt.textSpace + chartOpt.legendWidth, chartOpt.bottom);

        var color = getColor(k);
        ctx.setFillStyle(color);
        ctx.fillRect(x, y + 1, chartOpt.legendWidth, chartOpt.legendHeight);
      }
    } 
  }
}
/**
 * 绘制数据标签
 */
function drawToolTips(ctx, text, x, y, color) {
  ctx.setFillStyle(color);
  ctx.setFontSize(dataSet.xAxis.size)
  ctx.setTextAlign('center');
  ctx.fillText(text, x, y);
}
/**
 * 画图
 */
function drawCharts(ctx) {
  var series = dataSet.series;
  for (var i = 0; i < series.length; i++) {
    var category = series[i].category;
    if (category == 'pie') {
      drawPieChart(ctx, i, series);
    }
  }
}
/**
 * 绘制饼图
 */
function drawPieChart(ctx, i, series) {
  var item = series[i];

  var x = (chartOpt.right - chartOpt.left) / 2 + chartOpt.left;
  var radius = (chartOpt.axisBottom - chartOpt.axisTop) / 3;
  var y = (chartOpt.axisBottom - chartOpt.axisTop) / 2 + chartOpt.axisTop

  var lastAngel = 0;
  for (var k = 0; k < item.data.length; k++) {
    var color = getColor(k);
    var curAngel = 2 / chartOpt.chartPieCount * item.data[k];
    var precent = 100 / chartOpt.chartPieCount * item.data[k];

    drawPieToolTips(ctx, item.data[k] + "(" + Math.round(precent) + "%)", color, x, y, radius, lastAngel, curAngel);

    ctx.setFillStyle(color);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, radius, (lastAngel - 0.5) * Math.PI, (lastAngel + curAngel - 0.5) * Math.PI);
    ctx.fill();
    ctx.closePath();
    lastAngel += curAngel;

  }
}
/**
 * 绘制饼图数据标签
 */
function drawPieToolTips(ctx, value, color, x, y, radius, lastAngel, curAngel) {
  var textWidth = util.mesureText(value, dataSet.xAxis.size);
  var cosc = Math.cos((lastAngel - 0.5 + curAngel / 2) * Math.PI);
  var sinc = Math.sin((lastAngel - 0.5 + curAngel / 2) * Math.PI);
  var x1 = (radius) * cosc + x;
  var y1 = (radius) * sinc + y;

  var x2 = (radius + 20) * cosc + x;
  var y2 = (radius + 20) * sinc + y;

  ctx.setFillStyle(color);
  ctx.setTextAlign(x2 < x1 ? 'right' : 'left');
  ctx.setFontSize(dataSet.xAxis.size);
  ctx.setStrokeStyle(color);
  ctx.setLineWidth(1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  if (x1 >= x && y1 < y) {
    ctx.quadraticCurveTo(x2, y2, x2 + 15, y2)
    ctx.fillText(value, x2 + 15 + chartOpt.textSpace, y2 + dataSet.xAxis.size / 2);
  } else if (x1 >= x && y1 >= y) {
    ctx.quadraticCurveTo(x2, y2, x2 + 15, y2)
    ctx.fillText(value, x2 + 15 + chartOpt.textSpace, y2 + dataSet.xAxis.size / 2);
  } else if (x1 < x && y1 >= y) {
    ctx.quadraticCurveTo(x2, y2, x2 - 15, y2)
    ctx.fillText(value, x2 - 15 - chartOpt.textSpace, y2 + dataSet.xAxis.size / 2);
  } else if (x1 < x && y1 < y) {
    ctx.quadraticCurveTo(x2, y2, x2 - 15, y2)
    ctx.fillText(value, x2 - 15 - chartOpt.textSpace, y2 + dataSet.xAxis.size / 2);
  }
  ctx.stroke();
  ctx.closePath();
}

/**
 * 保存图表为图片
 */
function saveCanvans(func) {
  wx.canvasToTempFilePath({
    canvasId: canvasId,
    success: function (res) {
      console.log(res.tempFilePath)
      // wx.previewImage({
      //   urls: [res.tempFilePath],
      // })
      wx.saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
        success(ress) {
          console.log(ress)
        }
      })
    }
  })
}


/**
 * 获取柱状图颜色值，循环渲染
 */
function getColor(index) {
  var cLength = dataSet.color.length;
  if (index >= cLength) {
    return dataSet.color[index % cLength];
  } else {
    return dataSet.color[index];
  }
}