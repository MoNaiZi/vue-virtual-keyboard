let QQShuru ={
	HWPanel:{
		ajax_callback:function(X){
			console.log(X);
		}
	},
	get:function(a, c){
		var b = document.createElement("script");
		b.setAttribute("charset", "utf-8");
		b.id = Math.random();
		document.getElementsByTagName("head")[0].appendChild(b);
		b.src = a + "&c=" + c;
		if (navigator.appName == "Microsoft Internet Explorer") {
		    b.onreadystatechange = function() {
		        if (b.readyState == "loaded") {
		            document.getElementsByTagName("head")[0].removeChild(b)
		        }
		    }
		} else {
		    b.onload = function() {
		        document.getElementsByTagName("head")[0].removeChild(b)
		    }
		}
	}
};