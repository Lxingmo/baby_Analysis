var app=new Vue({
	el:"#app1",
	data(){
		return {
            status_now: {
                emotions: "常态，常态",
                status: "睡眠",
                abnormal: "无",
            },

            // 视频播放参数 flashvars、params、attrs
            flashvars: {
                // src: "rtmp://192.168.10.62:1936/myapp/53572ec4-1579-4886-818a-55fa81b14f96",
                src: "",
                streamType: "live",
                scaleMode: "zoom", // 自动缩放
                bufferTime: 0.2,
                controlBarAutoHideTimeout: 0, // 播放隐藏工具栏
            },
            params: {
                allowFullScreen: false,
                allowScriptAccess: "always",
                bgcolor: "#000000",
            },
            attrs: {
                name: "player",
            },
            // 视频宽度
            video_width: "51.85%",

            // 推流测试
            default_data: [
                {
                    time: "16:45:20",
                    mood: "常态，常态",
                    status: "睡眠",
                    photo: "img/img1.png",
                    colorLabel: "#5CBB85",
                    key: (new Date()).getTime(),
                },
                {
                    time: "12:45:20",
                    mood: "高兴，清醒",
                    status: "睡眠",
                    photo: "img/img2.png",
                    colorLabel: "#5CBB85",
                    key: (new Date()).getTime(),
                },
                {
                    time: "10:45:20",
                    mood: "惊讶，惊讶",
                    status: "睡眠",
                    photo: "img/img3.png",
                    colorLabel: "#5CBB85",
                    key: (new Date()).getTime(),
                },
                {
                    time: "09:45:20",
                    mood: "常态，常态",
                    status: "睡眠",
                    photo: "img/img4.png",
                    colorLabel: "#C1A90D",
                    key: (new Date()).getTime(),
                },
                {
                    time: "06:45:20",
                    mood: "难过，愤怒",
                    status: "睡眠",
                    photo: "img/img5.png",
                    colorLabel: "red",
                    key: (new Date()).getTime(),
                },
            ],
            // 推流接收数据变量
            alarm_data: [],

            // 婴儿状态分析数据
            status_data_emotions1: [
                {value: 0, name: '常态'},
                {value: 0, name: '快乐'},
                {value: 0, name: '伤心'},
                {value: 0, name: '惊讶'},
                {value: 0, name: '害怕'},
                {value: 0, name: '嫌弃'},
                {value: 0, name: '生气'},
            ],status_data_emotions2: [
                {value: 0, name: '常态'},
                {value: 0, name: '快乐'},
                {value: 0, name: '伤心'},
                {value: 0, name: '惊讶'},
                {value: 0, name: '害怕'},
                {value: 0, name: '嫌弃'},
                {value: 0, name: '生气'},
            ],
            mypie1:null,

            status_data:[
                {value:0, name:'哭闹'},
                {value:10, name:'清醒'},
                {value:10, name:'睡眠'}
            ],
            mypie2: null,
        }
	},
	methods:{
		// 播放视频函数
		play_video:function (play_src) {
			this.flashvars.src = play_src
            swfobject.embedSWF("/static/grindPlayer/GrindPlayer.swf", "player1", "100%", "100%", "10.2", null, this.flashvars, this.params, this.attrs);
        },

        // 饼状图
        mypie_init:function () {
            //饼状图
            this.mypie1 = echarts.init(document.getElementById('mypie1'));

            var option = {
                title : {
                    // backgroundColor: "rgba(0,0,0,0.4)",
                    text: "婴儿状态\n   分析",
                    textStyle:{
                        fontSize: 30,
                        color: 'rgba(250,250,250,0.5)',
                        fontWeight: 'bold',
                    },
                    align: 'center',
                    x:'33%',
                    y:'40%',
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    x : 'center',
                    y : 'bottom',
                    data:['哭闹','清醒','睡眠']
                },
                color: ['rgba(243,32,148,0.8)','rgba(50,225,129,0.8)','rgba(239,117,74,0.8)','rgba(230,148,28,0.8)','#ca8622','#efdf00','#c23531'],
                series: [
                    {
                        name:'婴儿状态分析',
                        type:'pie',
                        radius: ['50%', '70%'],
                        minAngle: 20,
                        avoidLabelOverlap: false,
                        labelLine: {
                            normal:{
                                length:0,
                                length2:0,
                                show: true,
                            },
                        },
                        label: {
                            normal: {
                                show: true,
                                color: '#efefef',
                                fontWeight: 'bold',
                                fontSize: 30,
                                position: 'outside',
                            },
                            // emphasis: {
                            //     show: true,
                            //     textStyle: {
                            //         fontSize: '30',
                            //         fontWeight: 'bold'
                            //     }
                            // }
                        },
                        // labelLine: {
                        //     normal: {
                        //         show: false
                        //     }
                        // },
                        data: this.status_data,
                    }
                ]
            };
            // 为echarts对象加载数据
            this.mypie1.setOption(option);
        },
        mybar_init:function () {
            //柱状图
            this.mypie2 = echarts.init(document.getElementById('mypie2'));


            let option = {
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'center',
                    y : 'bottom',
                    data:['伤心','快乐','惊讶','害怕','生气','嫌弃','常态'],
                    inactiveColor: '#fff',
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        dataView : {show: false, readOnly: false},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore : {show: true},
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                graphic: [
                    {
                        type: 'text',
                        z: 100,
                        left: '23.5%',
                        top: '45.5%',
                        style: {
                            fill: 'rgba(250,250,250,0.5)',
                            text: '显',
                            font: '28px bold Microsoft YaHei',
                        }
                    },
                    {
                        type: 'text',
                        z: 100,
                        right: '23.5%',
                        top: '45.5%',
                        style: {
                            fill: 'rgba(250,250,250,0.5)',
                            text: '隐',
                            font: '28px bold Microsoft YaHei',
                        }
                    },
                ],
                series : [
                    {
                        name:'显性情绪',
                        type:'pie',
                        radius : [20, 110],
                        center : ['25%', '50%'],
                        roseType : 'area',
                        // 图形文本标签
                        label:{
                            normal:{
                                show: true,
                                position: 'outside',
                                fontWeight: 'bold',
                                fontFamily: 'Microsoft YaHei',
                                fontSize: 30,
                                color: '#efefef',
                                // formatter: function (data) {
                                //     return '{a|'+data.name+'}'
                                // },
                                // rich:{
                                //     a:{
                                //         color: '#ffffff',
                                //         // lineHeight: 30,
                                //         fontSize: 30,
                                //         fontWeight: 'lighter',
                                //         backgroundColor: 'black',
                                //     }
                                // }
                            },
                            // emphasis: {
                            //     show: false,
                            // }
                        },
                        labelLine:{
                            normal:{
                                show: true,
                                lineStyle:{
                                    width: 3,
                                },
                            },
                        },

                        data:this.status_data_emotions1,
                    },
                    {
                        name:'隐性情绪',
                        type:'pie',
                        radius : [20, 110],
                        center : ['75%', '50%'],
                        roseType : 'area',

                        // 总和为零时，不显示（在存在label时不适用）
                        // stillShowZeroSum: false,

                        // 起始位置 以 x轴 正方向为0
                        startAngle: 45,

                        cursor: 'pointer',

                        // 图形文本标签
                        label:{
                            normal:{
                                show: true,
                                position: 'outside',
                                fontWeight: 'bold',
                                fontFamily: 'Microsoft YaHei',
                                fontSize: 30,
                                color: '#efefef',
                                // formatter: function (data) {
                                //     return '{a|'+data.name+'}'
                                // },
                                // rich:{
                                //     a:{
                                //         color: '#ffffff',
                                //         // lineHeight: 30,
                                //         fontSize: 30,
                                //         fontWeight: 'lighter',
                                //         backgroundColor: 'black',
                                //     }
                                // }
                            },
                            // emphasis: {
                            //     show: false,
                            // }
                        },
                        labelLine:{
                            normal:{
                                show: true,
                                lineStyle:{
                                    width: 3,
                                },
                            },
                        },

                        // 填入数据
                        data: this.status_data_emotions2,
                    }
                ]
            }
            // 为echarts对象加载数据
            this.mypie2.setOption(option);
        },

        // 取得区间内随机整数
        rnd:function(n, m){
            let random = Math.floor(Math.random()*(m-n+1)+n)
            return random
        }
	},
	mounted(){
	    // 图表初始化
	    this.mypie_init()
        this.mybar_init()

		this.play_video("")
        this.video_width = parseInt(this.$refs.video.offsetHeight/9 *16).toString()
        // 编写窗口变化函数，为视频div宽度赋值
        window['onresize'] = () => {
            this.video_width = parseInt(this.$refs.video.offsetHeight/9 *16).toString()
        }

        // 推流模拟测试
        let count = 0
        setInterval(()=>{
            if( this.alarm_data.length > 4 ){
                this.alarm_data.pop()
            }
            this.default_data[count].key = (new Date()).getTime()
            this.alarm_data.splice(0,0,this.default_data[count])
            count += 1
            if( count > 4 ){
                count = 0
            }

            for( let i = 0; i < this.status_data.length; i++ ){
                this.status_data[i].value +=  this.rnd(20,100)
            }
            let option1 = {
                series : [
                    {
                        data: this.status_data,
                    },
                ]
            }
            this.mypie1.setOption(option1)
            for( let i = 0; i < this.status_data_emotions1.length; i++ ){
                this.status_data_emotions1[i].value =  this.rnd(1,100)
                this.status_data_emotions2[i].value +=  this.rnd(1,100)
            }
            let option2 = {
                series : [
                    {
                        data: this.status_data_emotions1,
                    },{
                        data: this.status_data_emotions2,
                    },
                ]
            }
            this.mypie2.setOption(option2)
        },1000)
	},
})


