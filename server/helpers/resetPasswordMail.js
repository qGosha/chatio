module.exports = (link, name) => {
 return (
   `<html>
   <head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
     <meta name="viewport" content="width=device-width">
   </head>
   <body>
     <header>
       <p>Hello, ${name}!</p>
     </header>
     <main>
       <p>This is the link to reset your password:</p>
       <p>
         <a href=${link}>${link}</a>
       </p>
     </main>
     <footer>
       <p>All the best</p>
     </footer>
   </body>
   </html>`
 )
}
