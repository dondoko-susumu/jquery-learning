jQuery(function($){
  $('#twitter-search-test').show();

  module('フォームのテスト',{
    setup: function() {
      this.form = $('#twitter-search form');
      this.params = {
        q:           this.form.find('[name=q]'),
        result_type: this.form.find('[name=result_type]'),
        count:       this.form.find('[name=count]'),
        lang:        this.form.find('[name=lang]')
      };
    },
    teardown: function() { delete this.form, delete this.params; }
  });

  test('フォームの構造', 10, function(){
    //moduleで設定した値はtest間でthisで参照できる。
    var params = this.params;
    var form   = this.form;

    ok(/input/i.test(params.q.get(0).tagName),'検索ワード入力フィールド(q)はINPUTタグ');
    equal(params.q.get(0).type,'text','検索ワード入力フィールド(q)はテキスト');

    ok(/select/i.test(params.result_type.get(0).tagName),'検索対象(result_type)はSELECTタグ');
    ok(params.result_type.find('option').length > 0,'検索対象(result_type)にoptionが含まれている');

    ok(/select/i.test(params.count.get(0).tagName),'1ページあたりの件数(count)はSELECTタグ');
    ok(params.count.find('option').length > 0,'1ページあたりの件数(count)にoptionが含まれている');

    ok(/select/i.test(params.lang.get(0).tagName),'言語(lang)はSELECTタグ');
    ok(params.lang.find('option').length > 0,'言語(lang)にoptionが含まれている');

    ok(form.find('input[type="submit"]').length === 1 && form.find('input[type="submit"]').val() == '検索','検索ボタンが1つ存在する');

    ok(form.find('input[type="reset"]').length === 1 && form.find('input[type="reset"]').val() == 'クリア','クリアボタンが1つ存在する');

  });

  test('フォームの初期値', 7 , function(){
    var params = this.params;

    strictEqual(params.q.val().length, 0, '検索ワードは入力されていない');

    deepEqual(params.result_type.find('option').map(function(tag){
      return [[$(this).text(), this.value]]; }).get(),
      [['最新','recent'], ['トップ','popular']],
      '検索対象(result_type)のoptionは[最新,recent]と[トップ, popular]');
    equal(params.result_type.val(), 'recent','検索対象(result_type)の初期値はrecent');

    deepEqual(params.count.find('option').map(function(){
      return [[$(this).text(), Number(this.value)]]; }).get(),
      [['5件',5],['10件',10],['20件',20]],
      '1ページあたりの件数(count)のoptionは[5件,5],[10件,10],[20件,20]');
    equal(params.count.val(), 5,'1ページあたりの件数(count)の初期値は5');

    deepEqual(params.lang.find('option').map(function(){
      return [[$(this).text(), this.value]]; }).get(),
      [['日本語','ja'],['English','en']],
      '言語(lang)のoptionは[日本語,ja],[English,en]');
    equal(params.lang.val(), 'ja','言語(lang)の初期値はja');

  });

  module('つぶやきのテキストを表示用に編集',{
    setup: function() {
      if (!TwitterSearch.view) TwitterSearch.init();
    }
  });

  test('リンクの追加', function(){
    var renderText = TwitterSearch.renderText;
    equal(renderText('jQuery', '@gihyo'),
      '<a class="search" href="javascript:void(0);">@gihyo</a>',
      '@ユーザー名(replyまたはmention)にリンク追加');
    equal(renderText('jQuery', '#gihyo'),
      '<a class="search" href="javascript:void(0);">#gihyo</a>',
      'ハッシュタグにリンク追加');
    equal(renderText('jQuery', 'http://gihyo.jp/'),
      '<a target="_blank" href="http://gihyo.jp/">http://gihyo.jp/</a>',
      '外部サイトへのリンク追加');
  });

  test('キーワードの強調', function(){
    var renderText = TwitterSearch.renderText;
    var keyword = '"jQuery UI" Or jQuery';

    //キーワードの強調のみ
    equal(renderText(keyword ,'jQuery jQuery UI'),
      '<span class="query">jQuery</span> ' +
      '<span class="query">jQuery UI</span>' ,
      'キーワードの強調("〜"への対応)');
    equal(renderText(keyword ,'jquery jquery ui'),
      '<span class="query">jquery</span> ' +
      '<span class="query">jquery ui</span>' ,
      'キーワードの強調(小文字)');
    equal(renderText(keyword ,'JQUERY JQUERY ui'),
      '<span class="query">JQUERY</span> ' +
      '<span class="query">JQUERY ui</span>' ,
      'キーワードの強調(大文字・小文字混在)');

    // リンクとの組み合わせ（キーワードがハッシュタグなどにも含まれる場合）
    equal(renderText(keyword ,'jQuery UI @jQuery'),
      '<span class="query">jQuery UI</span> ' +
      '<a class="search" href="javascript:void(0);">@<span class="query">jQuery</span></a>',
      'リンク内でもキーワード強調(@ユーザー名)');
    equal(renderText(keyword ,'jQuery UI #jQuery'),
      '<span class="query">jQuery UI</span> ' +
      '<a class="search" href="javascript:void(0);">#<span class="query">jQuery</span></a>',
      'リンク内でもキーワード強調(#ハッシュタグ)');
    equal(renderText(keyword ,'http://jqueryui.com/ http://jquery.com/'),
      '<a target="_blank" href="http://jqueryui.com/">http://<span class="query">jquery</span>ui.com/</a> ' +
      '<a target="_blank" href="http://jquery.com/">http://<span class="query">jquery</span>.com/</a>' ,
      'リンク内でもキーワード強調(外部サイト)');
  });

  module('検索後の画面表示のテスト', {
    setup: function(){
      if (!TwitterSearch.view) TwitterSearch.init();
      this.form = $('#twitter-search form');
      this.result = $('#twitter-search-result');
      this.queryList = this.result.find('.query-list');
      this.paginate = this.result.find('.paginate');
    },
    teardown: function() {
      delete this.form;
      delete this.result;
      delete this.queryList;
      delete this.paginate;
    }
  });

  test('検索する前', function() {
    var result = this.result;
    var queryList = this.queryList;
    var paginate = this.paginate;

    strictEqual(TwitterSearch.cache,null,
      'データキャッシュはnull');
    strictEqual(queryList.find('a.serch').length,0,
      'キーワードリストのリンクは存在しない');
    strictEqual(paginate.find('a').length,0,
      'ページ送りのリンクは存在しない');
    strictEqual(result.find('p.tweet').length,0,
      'つぶやきは表示されていない');
  });

  asyncTest('最初の検索結果', function(){
    var form = this.form;
    var result = this.result;
    var queryList = this.queryList;
    var paginate = this.paginate;
    var keyword = 'jQuery';

    form.find('[name=q]').val(keyword);
    TwitterSearch.search();

    setTimeout(function(){
      notStrictEqual(TwitterSearch.cache,null,
        'データキャッシュはnullではなくなった');
      equal(queryList.find('a').length,1,
        'キーワードリストが１つ追加された');
      deepEqual(queryList.find('a.search').map(function() {
        return $(this).text(); }).get(), [keyword],
        'キーワードリストはjQueryのみ');

      deepEqual(paginate.find('a').map(function(){
        return [[this.className,$(this).text()]]; }).get(),
        [['update','更新'],['next','次へ \u00bb']],
        '「更新」「次へ」のリンクが追加された');

      equal(result.find('p.tweet').length,
        form.find('[name=count]').val(),
        '表示されるつぶやきの数はフォームで設定した値と同じ');
      start();
    },3000);
  });

  asyncTest('2ページ目', function(){
    var form = this.form;
    var result = this.result;
    var paginate = this.paginate;
    var cache = TwitterSearch.cache;

    ok(cache.search_metadata.since_id === 0,'現在１ページ目');

    paginate.find('a.next').click();

    setTimeout(function(){
      ok(TwitterSearch.cache.search_metadata.max_id < cache.search_metadata.max_id,'2ページ目');
      notDeepEqual(cache.statuses,TwitterSearch.cache.statuses,'つぶやきの内容が変化している');

      deepEqual(paginate.find('a').map(function(){
        return [[this.className,$(this).text()]]; }).get(),
        [['update','更新'],['next','次へ \u00bb']],
        'ページ送りのリンクは変化しない');
      equal(result.find('p.tweet').length,
        form.find('[name=count]').val(),
        'つぶやきの数はフォームの設定と同じ');

      start();
    },3000);
  });
});
