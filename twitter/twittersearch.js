var TwitterSearch;
(function($) {
  TwitterSearch = {
    //url: 'twittersearch.php?callback=?',
    url: 'twittersearch.php',
    cache: {},

    init: function() {
      this.view   = $('#twitter-search');
      this.form   = this.view.find('form');
      this.result = $('#twitter-search-result');
      this.query  = this.form.find(':text');

      var self = this;
      this.form.submit($.proxy(this, 'search', undefined));

      this.result.on('.update', 'click', function(){
        if(self.cache) self.search(self.cache.search_metadata.refresh_url.slice(1) + 
          '&count=' + self.form.find('[name=count]').val());
      })
      .on('click','.next',function(){
        if(self.cache) self.search(self.cache.search_metadata.next_page.slice(1));
      }).on('click','.search',function(){
        self.query.val($(this).text());
        self.search();
      });

      this.query.focus();
    },

    search: function(params) {
      if(!params) {
        var trimedQuery = $.trim(this.query.val());
        if(!trimedQuery.length) return false;
        this.query.val(trimedQuery);
        params = this.form.serialize();
      }
      //$.getJSON(this.url,params).done($.proxy(this,'rendor'));
      $.get(this.url,params,$.noop,'json').done($.proxy(this,'render'));
      return false;
    },

    render: function(data,statusText,jqXHR) {
      this.cache = null;
      this.result.find('.tweet').remove().end()
        .find('.paginate').empty().end()
        .find('.not-found').remove();

      if(!data) return false;

      this.cache = data;

      var paginate = this.result.find('.paginate');
      if(data.search_metadata && data.search_metadata.refresh_url 
          && data.search_metadata.refresh_url.length > 1) {
        $('<a>',{class:'update',href:'javascript:void(0);',text: '更新'}).appendTo(paginate);
      }

      if(data.statuses && data.statuses.length > 0) {
        var query = decodeURIComponent(data.search_metadata.query.replace(/\+/g,' '));

        var list = $('.query-list .search').filter(function() {
          return $(this).text() === query;
        });
        if(!list.length){
          $('<a>',{class: 'search', href: 'javascript:void(0);', text:query}).appendTo(this.result.find('.query-list'));
        }

        $($('#twitter-search-tweet-tmpl').render(
          data.statuses, {renderText: $.proxy(this, 'renderText', query)}
        )).appendTo(this.result);
      } else {
        $('<p calss="not-found">つぶやきは見つかりませんでした</p>').appendTo(this.result);
      }
    },

    renderText: function(query, text) {
      var wordMatcher = query.replace(/([\/\.\?\,\|\+\-\!\^\$\(\)\{\}\[\]])/g, "\\$1")
        .replace(/((\S+)\s+)(?:OR\s+)?|([^"]+)"?$/g, function(m0,m1,m2,m3){
          if(m3 && !!m3.length) return m3;
          return /^"/.test(m1) ? m1.replace(/^"/,'') : m2.replace(/"$/, '') + '|';
      });
/*
      var w1= query.replace(/([\/\.\?\,\|\+\-\!\^\$\(\)\{\}\[\]])/g, "\\$1");
      var w2= w1.replace(/((\S+)\s+)(?:OR\s+)?|([^"]+)"?$/g, function(m0,m1,m2,m3){
        console.log(m0);
        console.log(m1);
        console.log(m2);
        console.log(m3);
      });
*/

      var regexQuery = new RegExp('(<[^>]+="[^"]*)?(' + wordMatcher +')', 'ig');
      return text.replace(
        /(http:\/\/[^"”「」@\]\(\)\{\}\s]+)/g,
        "<a target=\"_blank\" href=\"$1\">$1</a>")
        .replace(
          /(@\w+|[#＃][^"”「」@\:\(\)\{\}\s]+)/g,
          "<a class=\"search\" href=\"javascript:void(0);\">$1</a>")
        .replace(regexQuery, function(m0,m1,m2){
          return (m1 && !!m1.length) ? m0 :
            '<span class="query">' + m2 + '</span>';
        });
    }
  }
})(jQuery);
