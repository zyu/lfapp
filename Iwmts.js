L.TileLayer.WMTS = L.TileLayer.extend({

				defaultWmtsParams: {
						service: 'WMTS',
						request: 'GetTile',
						version: '1.0.0',
						layer: '',
						style: '',
						tilematrixSet: '', 
						format: 'image/jpeg'
				},

				initialize: function (url, options) { // (String, Object)
						this._url = url;
						var wmtsParams = L.extend({}, this.defaultWmtsParams),
							tileSize = options.tileSize || this.options.tileSize;
						if (options.detectRetina && L.Browser.retina) {
								wmtsParams.width = wmtsParams.height = tileSize * 2;
						} else {
								wmtsParams.width = wmtsParams.height = tileSize;
						}
						for (var i in options) {
								// all keys that are not TileLayer options go to WMTS params
								if (!this.options.hasOwnProperty(i) && i!="matrixIds") {
										wmtsParams[i] = options[i];
								}
						}
						this.wmtsParams = wmtsParams;
						this.matrixIds = options.matrixIds;
						
						//为了判断底图和标注自定义了一个变量
						this.mapType = options.mapType;
						
						L.setOptions(this, options);
				},

				onAdd: function (map) {
						L.TileLayer.prototype.onAdd.call(this, map);
				},

				getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String
				
				console.dir(tilePoint);
						var map = this._map;
                crs = map.options.crs;
                tileSize = this.options.tileSize;
                nwPoint = tilePoint.multiplyBy(tileSize);
                //+/-1 pour 锚tre dans la tuile
                nwPoint.x+=1;
                nwPoint.y-=1; 
                sePoint = nwPoint.add(new L.Point(tileSize, tileSize)); 
                nw = crs.project(map.unproject(nwPoint, zoom));
                se = crs.project(map.unproject(sePoint, zoom));  
                tilewidth = se.x-nw.x;
                zoom=map.getZoom();
                ident = this.matrixIds[zoom].identifier;
                X0 = this.matrixIds[zoom].topLeftCorner.lng;
                Y0 = this.matrixIds[zoom].topLeftCorner.lat;
                tilecol=Math.floor((nw.x-X0)/tilewidth);
                tilerow=-Math.floor((nw.y-Y0)/tilewidth);
                
               
				if(ident<= 14){
                var type = this.mapType;
				var type_t;
				if (type.toLowerCase() == "vec")
					type_t = "vec_c";

				if (type.toLowerCase() == "img")
					type_t = "img_c";

				if (type.toLowerCase() == "vecl")
					type_t = "cva_c";
				if (type.toLowerCase() == "imgl")
					type_t = "cia_c";
				var url = this._url;
				 if (this.mirrorUrls != null) {
					url = this.selectUrl(x_num, this.mirrorUrls);
				}
				var suburl = url +"?T="+type_t;//url + "/" + type_t + "/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles";


			   return suburl + "&l=" + ident + "&y=" + tilerow +"&x=" + tilecol ;
					}	  
				},
				selectUrl: function (a, b) { 
					return b[Math.floor(Math.random() *8)]
				},																								

				setParams: function (params, noRedraw) {
						L.extend(this.wmtsParams, params);
						if (!noRedraw) {
								this.redraw();
						}
						return this;
				}
		});

		L.tileLayer.wmts = function (url, options) {
				return new L.TileLayer.WMTS(url, options);
		}; 