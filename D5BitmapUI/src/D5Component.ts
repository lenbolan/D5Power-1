//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, MicroGame Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
module d5power
{
    export class D5Component extends egret.Sprite 
    {
        public static MOVE_NUMBER:number = 10;
		public static MOVE_NONE:number = 0;
		public static MOVE_LEFT:number = 1;
		public static MOVE_RIGHT:number = 2;
		public static MOVE_DOWN:number = 3;
		public static MOVE_UP:number = 4;
		public static MOVE_ALPHA:number = 5;
        public static autoRelease:boolean=false;
        private static _preloadList:any = {};

        protected _w:number;
        protected _h:number;
        protected _nowName:string;
        /**
         * 归属，用于判断加载进度
         */
        protected _belone:string;
        protected _moveAction:number = 0;
        

		public get moveAction():number
		{
			return this._moveAction;
		}

		public set moveAction(value:number)
		{
			this._moveAction = value;
		}
		
		public startX:number;
		public startY:number;
		private static _me:D5Component;
		public static get me():D5Component
		{
			if(D5Component._me==null) D5Component._me = new D5Component();
			return D5Component._me;
		}
        public constructor()
        {
            super();
            if(D5Component.autoRelease) this.addEventListener(egret.Event.REMOVED_FROM_STAGE,this.dispose,this);
        }
        private static _moveList:Array<any> = [];
		
		public static addMoveList(target:D5Component):void
		{
			D5Component._moveList.push(target);
			if(!D5Component.me.hasEventListener(egret.Event.ENTER_FRAME))D5Component.me.addEventListener(egret.Event.ENTER_FRAME,this.onMoveUI,this);
		}
		private static onMoveUI(e:egret.Event):void
		{
			var obj:D5Component
			for(var i:number=D5Component._moveList.length-1;i>=0;i--)
			{
				obj = D5Component._moveList[i];
//				if((obj.x==obj.startX && obj.y==obj.startY &&obj.moveAction != D5Component.MOVE_ALPHA)||(obj.alpha==1&&obj.moveAction == D5Component.MOVE_ALPHA))
//				{
//					D5Component._moveList.splice(i,1);
//					continue;
//				}
				switch(obj.moveAction)
				{
					case D5Component.MOVE_LEFT:
						obj.x+= (obj.startX - obj.x)/5;
                        if(Math.ceil(obj.x) >= obj.startX) 
                        {
                            obj.x = obj.startX;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_RIGHT:
						obj.x-= (obj.x - obj.startX)/5;
                        if(Math.floor(obj.x) <= obj.startX) 
                        {
                            obj.x = obj.startX;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_UP:
						obj.y+= (obj.startY - obj.y)/5;
                        if(Math.ceil(obj.y) >= obj.startY) 
                        {
                            obj.y = obj.startY;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_DOWN:
						obj.y-=  (obj.y - obj.startY)/5;
                        if(Math.floor(obj.y) <= obj.startY) 
                        {
                            obj.y = obj.startY;
                            D5Component._moveList.splice(i,1);
                        }
						break;
					case D5Component.MOVE_ALPHA:
						obj.alpha+=(1 - obj.alpha)/5;
                        if(Math.abs(1 - obj.alpha) <= 0.01) 
                        {
                            obj.alpha = 1;
                            D5Component._moveList.splice(i,1);
                        }
						break;
				}
			}
			if(D5Component._moveList.length==0)D5Component.me.removeEventListener(egret.Event.ENTER_FRAME,this.onMoveUI,this);
		}
		
        /**
		 * 将与自己同容器，且在自己范围内的对象纳入自己的自对象，形成一个整体
		 * 
		 * @param   e   
		 * @param   skip    不进行合并的对象
         * @param   contain 必然进行合并的对象
		 */
		public add2Me(e:egret.Event=null,skip:Array<any>=null,contain:Array<any>=null):void
		{
			if(parent==null)
			{
				this.addEventListener(egret.Event.ADDED_TO_STAGE,this.add2Me,this);
				return;
			}
			if(e) this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.add2Me,this);
			var rect:egret.Rectangle = new egret.Rectangle(this.x,this.y,this.width,this.height);
			var arr:Array<egret.DisplayObject> = [];
			var _root:egret.DisplayObjectContainer = this.parent;
			for(var i:number=_root.numChildren-1;i>=0;i--)
			{
                var obj:any = _root.getChildAt(i);
                if(skip && skip.indexOf(obj)==-1) continue;
				if(obj!=this)
				{
					if(rect.contains(obj.x,obj.y) || (contain!=null && contain.indexOf(obj)!=-1))
					{
						obj.x = obj.x-this.x;
						obj.y = obj.y-this.y;
						arr.push(obj);
					}
				}
			}
			
			for(i=arr.length-1;i>=0;i--)
			{
				this.addChild(arr[i]);
            }
            
            this.parent.setChildIndex(this,0);
		}

        public setSkin(name:string):void
        {
            
        }
        protected static _pro_binding_source:IUserInfoContainer;
        /**
         * 属性绑定目标
         */
        public static setproBindingSource(obj:IUserInfoContainer):void
        {
            this._pro_binding_source = obj;
        }

        public static  get proBindingSource():IUserInfoContainer
        {
            return this._pro_binding_source;
        }

        public setSize(w:number,h:number):void
        {
            this._w = w;
            this._h = h;
            this.invalidate();
        }
        public get nowName():string
        {
            return this._nowName;
        }
        public get width():number
        {
            return this._w;
        }
        public get height():number
        {
            return this._h;
        }

        public static getComponentByURL(res:string,container:egret.DisplayObjectContainer,onPre:Function=null):void
        {
            var onLoaded:Function = function(obj:any)
            {
                var arr:Array<any> = obj.uiList;
                var length:number = arr.length;
                var comObj:any;
                var uiObj:D5Component;
                var src:string;
                var list:Array<any>=[];
                container['_realWidth'] = parseInt(obj.width);
                container['_realHeight'] = parseInt(obj.height);
                container['_flyX'] = obj.flyx;
                container['_flyY'] = obj.flyy;
                if(container['drawBg'] && <string>obj.bgImg!='')
                {
                    container['drawBg'](obj.bgImg);
                }
                
                for(var i:number = 0;i < length;i++)
                {
                    comObj = arr[i];
                    uiObj = D5Component.getCompoentByJson(comObj,container);
                    src = comObj.file;
                    if(src && D5UIResourceData.getData(src)==null)
                    {
                        uiObj._belone = res;
                        list.push(uiObj);
                    }

                    src = comObj.src;
                    if(src && D5UIResourceData.getData(src)==null)
                    {
                        uiObj._belone = res;
                        list.push(uiObj);
                    }
                    container.addChild(uiObj);
                }

                if(list.length)
                {
                    D5Component._preloadList[res]=[list,onPre,container];
                }else{
                    if(onPre) onPre.apply(container,[0]);
                }
                
            }
            
            RES.getResByUrl(res,onLoaded,null,RES.ResourceItem.TYPE_JSON);
        }

        protected loadResource(name:string,callback:Function,thisobj:any):void
        {
            RES.getResByUrl(name,callback,thisobj,RES.ResourceItem.TYPE_IMAGE);
        }

        public static getCompoentByJson(value:any,container:egret.DisplayObjectContainer):any
        {
            var com:D5Component;
            switch(value.Class)
            {
                case "D5Window":
                    com = new d5power.D5Window();
                    (<D5Window>com).x1 = parseInt(value.x1);
                    (<D5Window>com).y1 = parseInt(value.y1);
                    (<D5Window>com).x2 = parseInt(value.x2);
                    (<D5Window>com).y2 = parseInt(value.y2);
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    var arr:Array<any> = value.uiList;
                    var length:number = arr.length;
                    var comObj:any;
                    for(var i:number = 0;i < length;i++)
                    {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj,container));
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5MirrorBox":
                    com = new d5power.D5MirrorBox();
                    com.name = value.name;
                    (<D5MirrorBox>com).cutX = parseInt(value.cutX);
                    (<D5MirrorBox>com).cutY = parseInt(value.cutY);
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    var arr:Array<any> = value.uiList;
                    var length:number = arr.length;
                    var comObj:any;
                    for(var i:number = 0;i < length;i++)
                    {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj,container));
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5Button":
                    com = new d5power.D5Button();
                    (<D5Button>com).type = parseInt(value.type);
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    (<D5Button>com).setSound(value.soundDown)
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Button>com).setIcon(value.icon)
                    var callback_String:string = value.listener;
                    if(value.lable&&value.lable!='')
                    {
                        (<D5Button>com).setLable(value.lable);
                    }
                    if(callback_String!='' && callback_String!='null' && callback_String!=null && container!=null)
                    {
//                        if(container.hasOwnProperty(callback_String))
//                        {
//                        (<D5Button>com).setCallback(container[callback_String]);
//                        }else{
//                            trace("[D5Component] 未在"+container+"中发现所需要的按钮响应函数"+callback_String);
//                        }
                        (<D5Button>com).setCallback(container[callback_String]);
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5MirrorLoop":
                    com = new d5power.D5MirrorLoop();
                    com.name = value.name;
                    (<D5MirrorLoop>com)._mode = value.workmode;
                    (<D5MirrorLoop>com)._cutSize = value.cutsize;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    if(container) container[com.name] = com;
                    break;
                case "D5Bitmap":
                    com = new d5power.D5Bitmap();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    if(value.rotation!=0) com.rotation = value.rotation;
                    if(value.zoom) com.scaleX = com.scaleY = value.zoom;
                    if(container) container[com.name] = com;
                    break;
                case "D5RadioBtn":
                    com = new d5power.D5RadioBtn();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    if(value.group!=null && value.group!='') (<D5RadioBtn>com).groupName=value.group;
                    if(value.lable&&value.lable!='')
                    {
                        (<D5RadioBtn>com).setLable(value.lable);
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5FlyBox":
                    com = new d5power.D5FlyBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    (<D5FlyBox>com).setMaxWidth((<number>value.maxWidth));
                    if(container) container[com.name] = com;
                    break;
                case "D5HBox":
                    com = new d5power.D5HBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    if(container) container[com.name] = com;
                    break;
                case "D5VBox":
                    com = new d5power.D5VBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    if(container) container[com.name] = com;
                    break;
                case "D5Text":
                    com = new d5power.D5Text(value.textValue=='文字' ? '' : value.textValue,value.fontColor,-1,value.filterColor,value.fontSize);
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    (<D5Text>com).setType(value.type);
                    (<D5Text>com).setTextAlign(value.alignType);
                    (<D5Text>com).setFontBold((<boolean>value.bold));
                    (<D5Text>com).setBgColor(value.bgColor);
                    (<D5Text>com).setLtBorder(value.ltColor);
                    (<D5Text>com).setRbBorder(value.rbColor);
                    (<D5Text>com).setWrapFlg(value.wrapType);
                    (<D5Text>com).setIsPassword((<boolean>value.password));
                    (<D5Text>com).setTextID((value.textID).toString());
                    (<D5Text>com)._binding = value.binding;
                    if(container) container[com.name] = com;
                    if(container && <IProBindingContainer><any>container && (<D5Text>com)._binding!='') (<IProBindingContainer><any>container).addBinder(<D5Text>com);
                    break;
                case "D5ImageBox":
                    com = new d5power.D5ImageBox();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSize(value.width,value.height);
                    (<D5ImageBox>com).showNum(<boolean>value.shownum);
                    (<D5ImageBox>com).setLogo((value.bg).toString());
                    if(container) container[com.name] = com;
                    break;
                case "D5ButtonGroup":
                    com = new d5power.D5ButtonGroup();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    var arr:Array<any> = value.uiList;
                    var length:number = arr.length;
                    var comObj:any;
                    for(var i:number = 0;i < length;i++)
                    {
                        comObj = arr[i];
                        com.addChild(this.getCompoentByJson(comObj,container));
                    }
                    if(container) container[com.name] = com;
                    break;
                case "D5Swf":
                    com = new d5power.D5Swf();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Swf>com).setSrc(value.src);
                    if(container) container[com.name] = com;
                    break;
                case "D5BitmapNumber":
                    com = new d5power.D5BitmapNumber();
                    com.name = value.name;
                    com.setSkin(value.skinId);
                    com.x = value.x;
                    com.y = value.y;
                    //(<D5BitmapNumber>com).setPadding(value.src);
                    (<D5BitmapNumber>com).setAlign(value.align);
                    (<D5BitmapNumber>com).setValue('0');
                    if(container) container[com.name] = com;
                    break;
                case "D5Shape":
                    com = new d5power.D5Shape();
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    (<D5Shape>com).drawAlpha = value.fillAlpha==null ? 1 : value.fillAlpha;
                    (<D5Shape>com).setWorkMode(value.workMode);
                    (<D5Shape>com).setFillColor(value.fillColor);
                    (<D5Shape>com).setTickNess(value.tickNess);
                    (<D5Shape>com).setColor(value.color);
                    (<D5Shape>com).setOffX(value.offX);
                    (<D5Shape>com).setOffY(value.offY);
                    (<D5Shape>com).setSize(value.width,value.height);
                    (<D5Shape>com).setRadius(value.radius);
                    (<D5Shape>com).pointString = value.pointString;
                    if(container) container[com.name] = com;
                    break;
                case "D5Loop":
                
                    com = new D5Loop(value.workmode,value.cutsize1,value.cutsize2);
                    com.name = value.name;
                    com.x = value.x;
                    com.y = value.y;
                    com.setSkin(value.file);
                    com.setSize(value.width,value.height);
                    if(container) container[com.name] = com;
                    break;
            }
            com.startX = value.x;
			com.startY = value.y;
			com.moveAction = parseInt(value.moveAction);
            return com;
        }

        public dispose():void
        {

        }

        protected invalidate():void
        {
            this.once(egret.Event.ENTER_FRAME, this.draw,this);
        }

        public draw():void
        {
            this.invalidateSize();
            this.dispatchEvent(new egret.Event(egret.Event.RESIZE));
        }
        
        public invalidateSize(): void 
        {
            if(this._belone){
                var target:Array<any> = D5Component._preloadList[this._belone];
                if(!target) return;
                var list:Array<any> = target[0];
                var callback:Function = target[1];
                var thisobj:any = target[2];

                var index:number = list.indexOf(this);
                if(index!=-1)list.splice(index,1);
                callback.apply(thisobj,[list.length]);

                if(!list.length) delete D5Component._preloadList[this._belone];
                this._belone=null;
            }
        }
        

        protected autoCache():void
        {
            this.cacheAsBitmap=false;
            this.once(egret.Event.ENTER_FRAME, this.onAutoCache,this);
        }

        private onAutoCache(event:Event):void
        {
            this.cacheAsBitmap=true;
        }

    }
}