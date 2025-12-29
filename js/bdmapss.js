hostname = 180.76.76.200, newclient.map.baidu.com, httpdns.baidubce.com, ugc.map.baidu.com
https?:\/\/.*map\.baidu\.com\/.*govui\/rich_content url jsonjq-response-body '.data.posts.content=[]'
https?:\/\/newclient\.map\.baidu\.com\/client\/phpui.*qt=hw url reject-200
https?:\/\/newclient\.map\.baidu\.com\/client\/phpui2\/\?qt=ads url reject-200
https?:\/\/httpdns\.baidubce\.com url jsonjq-response-body '.data["newclient.map.baidu.com"]={}'
https?:\/\/newclient\.map\.baidu\.com\/client\/crossmarketing url reject-200
https?:\/\/newclient\.map\.baidu\.com\/client\/usersystem\/home\/dynamic url reject-200
https?:\/\/newclient\.map\.baidu\.com\/contributor-bus/bounty/tips url reject-200
https?:\/\/newclient\.map\.baidu\.com\/usercenter/mine/page url jsonjq-response-body 'del(.data.sport_card, .data.gold, .data.gold_coin_card, .data.shop)'
https?:\/\/newclient\.map\.baidu\.com\/living/nearby/hot-words\? url jsonjq-response-body '.Result.data=[]'