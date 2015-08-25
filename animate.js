//P.154
$('div').width(100).height(100)
	.css({float:'left',color:'white',fontSize:'23pt',
		margin:10,padding:5}).text(function(idx){
			$(this).css({backgroundColor:this.id});
			return this.id.toUpperCase();
	});

//アニメーション
var speed = 1000;
$('#blue,#green').slideUp(speed);
setTimeout(function(){$('#blue').slideDown(speed);},speed);
setTimeout(function(){$('div').slideToggle(speed);},speed * 2);

/*
//P.157
//要素の大きさなどを設定
$('div').width(100).height(100)
	.css({float:'left',color:'white',fontSize:'23pt',
		margin:10,padding:5}).text(function(idx){
			$(this).css({backgroundColor:this.id});
			$(this).toggle(idx % 2 !== 0); //一部の要素は非表示
			return this.id.toUpperCase();
	});

//アニメーション
var speed = 1000;
$('#red').fadeIn(speed);
$('#blue').fadeOut(speed);
$('#brown').fadeToggle(speed);
$('#green').fadeToggle(speed);
$('#black').fadeTo(speed,0.3);
*/
