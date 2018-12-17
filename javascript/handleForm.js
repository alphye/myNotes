/** 此方法支持提取对象数组，如：
  *<input name="a[0].b" value="1"/>
  *<input name="a[1].b" value="2" />
  *这样提取出来为{a:[{b:1},{b:2}]}
  *但是目前此方法仅支持一维数组 name="a[0][1]" 这样的格式是无法解析的
**/

		
	$.fn.AFSerializeObject = function() {
		var obj = {};
		var array = this.serializeArray();
		$.each(array, function () {
			if(!(/^(?!\.)([\w\d_]+(\[\d+\])?\.?)+(?<!\.)$/).test(this.name)){
				throw new Error("illegal name format:"+this.name);
			}
			anylizeName(obj,this.name,this.value||'');
		});
		return obj;
	};
		
	/**解析name表达式，根据表达式规则，将value值赋给正确的对象
	 * @param obj 要赋值的对象
	 * @param name name表达式
	 * @param value 被赋的值
	*/	
	function anylizeName(obj,name,value){
		var attrs=cutName(name);
		if(!attrs.push){ 
			setAtrributeValue(obj,name,value);
		}else{
			setNewObject(obj,attrs[0]);
			anylizeName(eval("obj."+attrs[0]),attrs[1],value);
		}

	}

	/**将obj对象的atrributeName属性赋值为对象：
	 * 如果obj下存在atrributeName属性，则不做处理，反之，给atrributeName赋值空对象
	 * @param obj 要赋值的对象
	 * @param atrributeName name属性名
	*/	
	function setNewObject(obj,atrributeName){
		if(atrributeName.match(/^([\w\d_]+)\[(\d+)\]$/)){ // 数组表达式
			obj[RegExp.$1]=obj[RegExp.$1]||[];
			obj[RegExp.$1][RegExp.$2]=obj[RegExp.$1][RegExp.$2]||{};
		}else{
			obj[atrributeName]=obj[atrributeName] || {};
		}
	}
	
	/**将对象的某个属性赋值为具体值
	 * @param obj 要赋值的对象
	 * @param atrribute 对象的属性
	 * @param value 被赋的值
	*/
	function setAtrributeValue(obj,atrribute,value){
		if(atrribute.match(/^([\w\d_]+)\[(\d+)\]$/)){ // 数组表达式
			obj[RegExp.$1]=obj[RegExp.$1]||[];
			obj[RegExp.$1][RegExp.$2]=value;
		}else{
			if (obj[atrribute]) {
				if (!obj[atrribute].push) {
					obj[atrribute] = [ obj[atrribute] ];
				}
				obj[atrribute].push(value);
			} else {
				obj[atrribute] = value;
			}
		}
	}
	
	
	/**从第一个"."的位置将name表达式截开
	 * @param name name表达式
	 * @return  如果name表达式中有"."字符，则返回数组，反之，将name表达试原样返回
	*/	
	function cutName(name){
		var index=-1;
		if((index=name.indexOf("."))<=0){
			return name;
		}
		var attrs=[];
		attrs[0]=name.substring(0,index);
		attrs[1]=name.substring(index+1);
		return attrs;
	}