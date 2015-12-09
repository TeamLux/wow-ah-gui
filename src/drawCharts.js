Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
}

function format(d){
	return [d.getFullYear(),
			   (d.getMonth()+1).padLeft(),
               d.getDate().padLeft()].join('/') +' ' +
              [d.getHours().padLeft(),
               d.getMinutes().padLeft(),
               d.getSeconds().padLeft()].join(':');
}

function read(filename)
{
	var req;
	if (window.XMLHttpRequest) {
		// Firefox, Opera, IE7, and other browsers will use the native object
		req = new XMLHttpRequest();
	} else {
		// IE 5 and 6 will use the ActiveX control
		req = new ActiveXObject("Microsoft.XMLHTTP");
	}

	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status === 200 ||  // Normal http
				req.status === 0) {    // Chrome w/ --allow-file-access-from-files
				fullText = req.responseText;
			}
		}
	};

	req.open("GET", filename, false);
	req.send(null);
}

function drawCharts(){
	drawChart()
	// google.setOnLoadCallback(drawChart);
}

function addHead(a,datas,isStd,isMax,isMin,isBid){
	var name;
	if(a==0)
		name = "buy";
	else if(a==1)
		name = "notbuy";
	else if(a==2)
		name = "sale";
	else if(a==3)
		name = "uptosale";

	if(datas[0].length==0)
		datas[0].push("Date");
	datas[0].push("Q_"+name);
	datas[0].push(name);
	if(isStd)
		datas[0].push("std_"+name);
	if(isMax){
		datas[0].push("max_"+name);
		if(isStd)
			datas[0].push("max_std_"+name);
	}
	if(isMin){
		datas[0].push("min_"+name);
		if(isStd)
			datas[0].push("min_std_"+name);
	}
	if(isBid){
		datas[0].push("bid_"+name);
		if(isStd)
			datas[0].push("bid_std_"+name);
		if(isMax){
			datas[0].push("bid_max_"+name);
			if(isStd)
				datas[0].push("bid_max_std_"+name);
		}
		if(isMin){
			datas[0].push("bid_min_"+name);
			if(isStd)
				datas[0].push("bid_min_std_"+name);
		}
	}
}

function addData(i,datas,isStd,isMax,isMin,isBid,line){
	data = line.split("\t")

	if(datas[i].length==0){
		sDate = data[0]
		datas[i].push(new Date(parseInt(sDate.substring(0,4)),parseInt(sDate.substring(4,6))-1,parseInt(sDate.substring(6,8)),parseInt(sDate.substring(8,10)),parseInt(sDate.substring(10,12)),parseInt(sDate.substring(12,14))))
	}
	//Date,inter,Q,max,min,avg,std,max,min,avg,std
	// 0  , 1   ,2, 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10
	datas[i].push(parseInt(data[2]));
	datas[i].push(parseInt(data[5]));
	if(isStd)
		datas[i].push(parseInt(data[6]));
	if(isMax){
		datas[i].push(parseInt(data[3]));
		if(isStd)
			datas[i].push(0);
	}
	if(isMin){
		datas[i].push(parseInt(data[4]));
		if(isStd)
			datas[i].push(0);
	}
	if(isBid){
		datas[i].push(parseInt(data[9]));
		if(isStd)
			datas[i].push(parseInt(data[10]));
		if(isMax){
			datas[i].push(parseInt(data[7]));
			if(isStd)
				datas[i].push(0);
		}
		if(isMin){
			datas[i].push(parseInt(data[8]));
			if(isStd)
				datas[i].push(0);
		}
	}
}

function google_table_price(datas,isStd,nType){
	var google_datas = new google.visualization.DataTable();
	google_datas.addColumn("date","Date");
	var size = (datas[0].length-1)/nType

	for(var offset = 0; offset < datas[0].length-1; offset+=size){
		var j = 1
		while(j<size){
			google_datas.addColumn("number",datas[0][j+offset+1]);
			if(isStd)
				j+=2;
			else
				j+=1;
		}
	}
	var rows = new Array();
	for(i=1;i<datas.length;i++){
		var row = new Array();
		row.push(datas[i][0]);
		for(var offset = 0; offset < datas[0].length-1; offset+=size){
			var j = 1
			while(j<size){
				row.push(datas[i][j+offset+1]/10000);
				if(isStd)
					j+=2;
				else
					j+=1;
			}
		}
		rows.push(row)
	}
	google_datas.addRows(rows);
	return google_datas
}

function google_table_Q(datas,nType){
	var google_datas = new google.visualization.DataTable();
	google_datas.addColumn("date","Date");
	var size = (datas[0].length-1)/nType

	for(var offset = 0; offset < datas[0].length-1; offset+=size){
		google_datas.addColumn("number",datas[0][offset+1]);
	}
	var rows = new Array();
	for(i=1;i<datas.length;i++){
		var row = new Array();
		row.push(datas[i][0]);
		for(var offset = 0; offset < datas[0].length-1; offset+=size){
			row.push(datas[i][offset+1]);
		}
		rows.push(row)
	}
	google_datas.addRows(rows);
	return google_datas
}

function dygraph_csv_price(datas,isStd,nType){
	var csv = "Date"
	var size = (datas[0].length-1)/nType
	for(var offset = 0; offset < datas[0].length-1; offset+=size){
		var j = 1
		while(j<size){
			csv+=","+datas[0][j+offset+1];
			if(isStd)
				j+=2;
			else
				j+=1;
		}
	}
	for(i=1;i<datas.length;i++){
		csv += "\n"
		csv += format(datas[i][0])
		for(var offset = 0; offset < datas[0].length-1; offset+=size){
			var j = 1
			while(j<size){
				csv += ","+(datas[i][j+offset+1]/10000);
				j+=1
			}
		}
	}
	return csv
}

function dygraph_csv_Q(datas,nType){
	var csv = "Date"
	var size = (datas[0].length-1)/nType
	for(var offset = 0; offset < datas[0].length-1; offset+=size){
		csv+=","+datas[0][offset+1];
	}
	for(i=1;i<datas.length;i++){
		csv += "\n"
		csv += format(datas[i][0])
		for(var offset = 0; offset < datas[0].length-1; offset+=size){
			csv += ","+(datas[i][offset+1]);
		}
	}
	return csv
}

function drawChart(){
	var i = 0

	var form = document.getElementById("form")

	var item_id = form.elements["item_id"].value;

	var isBuy = form.datas[0].checked;
	var isNotbuy = form.datas[1].checked;
	var isSale = form.datas[2].checked;
	var isUptosale = form.datas[3].checked;
	var nType = isBuy+isNotbuy+isSale+isUptosale

	var isStd = form.adds[0].checked;
	var isMax = form.adds[1].checked;
	var isMin = form.adds[2].checked;
	var isBid = form.adds[3].checked;

	var allTexts = new Array();

	if(isBuy){
		read("../wow-AH-python/results/structure/buy/"+item_id+".txt");
		allTexts[0] = fullText.split("\n");
	}
	if(isNotbuy){
		read("../wow-AH-python/results/structure/notbuy/"+item_id+".txt");
		allTexts[1] = fullText.split("\n");
	}
	if(isSale){
		read("../wow-AH-python/results/structure/sale/"+item_id+".txt");
		allTexts[2] = fullText.split("\n");
	}
	if(isUptosale){
		read("../wow-AH-python/results/structure/uptosale/"+item_id+".txt");
		allTexts[3] = fullText.split("\n");
	}

	var datas = new Array();
	datas.push(new Array())
	for(var a = 0;a<4;a++){
		if(!form.datas[a].checked)
			continue;
		addHead(a,datas,isStd,isMax,isMin,isBid);
		for(i =0; i < allTexts[a].length-1;i++){
			if(datas[i+1]==undefined)
				datas[i+1] = new Array();
			addData(i+1,datas,isStd,isMax,isMin,isBid,allTexts[a][i]);
		}
	}
	var google_datas_price = google_table_price(datas,isStd,nType);

	var dygraph_datas_price = dygraph_csv_price(datas, isStd,nType);

	var google_datas_Q = google_table_Q(datas,nType);

	var dygraph_datas_Q = dygraph_csv_Q(datas,nType);

	var chart_price = new google.visualization.AnnotatedTimeLine(document.getElementById('gviz_div'));
 	chart_price.draw(google_datas_price,  {displayAnnotations: true});

 	var g_price = new Dygraph(document.getElementById("dg_div"),dygraph_datas_price,
          {
            rollPeriod: 1,
            showRoller: true,
            errorBars : isStd,
            legend: 'always'
          });

	var chart_price = new google.visualization.AnnotatedTimeLine(document.getElementById('gviz_div_q'));
 	chart_price.draw(google_datas_Q,  {displayAnnotations: true});

 	var g_price = new Dygraph(document.getElementById("dg_div_q"),dygraph_datas_Q,
          {
            rollPeriod: 1,
            showRoller: true,
            legend: 'always'
          });
}