let $ = {
Baidu:'https://www.baidu.com',
Google:'https://www.google.com/generate_204',
Github:'https://www.github.com',
Youtube:'https://www.youtube.com/'
}

!(async () => {
await Promise.all([http('Baidu'),http('Google'),http('Github'),http('Youtube')]).then((x)=>{
	$done({
    title: '网络延迟',
    content: x.join('\n'),
    icon: 'bolt.horizontal.icloud',
    'icon-color': '#5AC8FA',
  })
})
})();

function http(req) {
    return new Promise((r) => {
			let time = Date.now();
        $httpClient.post($[req], (err, resp, data) => {
            r(req +
						'\xa0\xa0\xa0\t: ' +
						(Date.now() - time)+' ms');
        });
    });
}
