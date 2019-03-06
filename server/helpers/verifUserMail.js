module.exports = (link, pin) => {
 return (
   `<html>
   <head>
   	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
   	<meta name="viewport" content="width=device-width">
   	<title>Confirm your email address</title>
     <link rel="stylesheet" href="./mail.css"></link>
   </head>

   <body class="body" style="font-family: -apple-system, BlinkMacSystemFont, Roboto, Ubuntu, Helvetica, sans-serif; line-height: initial; max-width: 580px;">
   	<header class="mt2 mb2" style="margin-bottom: 20px; margin-top: 20px;">
   	</header>
   	<h1 style="box-sizing: border-box; font-size: 1.25rem; margin: 0; margin-bottom: 0.5em; padding: 0;">Thanks for joining!</h1>
   	<p style="box-sizing: border-box; margin: 0; margin-bottom: 0.5em; padding: 0;">Please confirm that your email address is correct to continue.</p>

    <p class="db mb1 gray" style="box-sizing: border-box; color: #222; display: block; margin: 0; margin-bottom: 10px; padding: 0;">This is your confirmation pin:</p>
    <p style="box-sizing: border-box; margin: 0; margin-bottom: 0.5em; padding: 0;">
      </p><pre style="background: #f6f6f3; border: 1px solid #d8d7d4; border-radius: 3px; display: inline-block; font-family: monospace; font-size: 3rem; font-weight: 600; line-height: 1em; margin: 0; padding: 5px 8px;">${pin}</pre>
    <p></p>
   <br>
   <p class="db mb1 gray" style="box-sizing: border-box; color: #999; display: block; margin: 0; margin-bottom: 10px; padding: 0;">You may also use the confirmation link below</p>
   	<p class="mt2 mb2 mt3--lg mb3--lg" style="box-sizing: border-box; margin: 0; margin-bottom: 20px; margin-top: 20px; padding: 0;">
   		<span class="button__shadow" style="border-radius: 4px; box-sizing: border-box; display: block; width: 100%;">
   			<a class="button" href=${link} style="background: #204dd5; border: 1px solid #000; border-radius: 3px; box-sizing: border-box; color: white; display: block; font-size: 1rem; font-weight: 600; padding: 4px 8px; text-align: center; text-decoration: none; width: 40%;" target="_blank">
   				Confirm Email Address
   			</a>
   		</span></p>

   	<footer class="mt2 mt4--lg" style="border-top: 1px solid #D9D9D9; margin-top: 20px; padding: 20px 0;">
   	</footer>
   </body>
   </html>`
 )
}
