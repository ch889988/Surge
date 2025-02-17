var body = $response.body.replace(/vip_label":false/g, 'vip_label":true')
	   .replace(/vip_expiry_date":null/g, 'vip_expiry_date":"2999-12-31"')
	   .replace(/is_pay":false/g, 'is_pay":true');
$done({ body });
