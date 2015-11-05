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
});
