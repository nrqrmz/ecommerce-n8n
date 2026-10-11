import http from 'node:http'
const cats=['beauty','fragrances','furniture','groceries','home-decoration','kitchen-accessories','laptops','mens-shirts','smartphones','sunglasses']
const O='http://localhost:8787'
const base=i=>({row_number:i+2,id:i+1,title:`Product ${i+1} ${cats[i%10]}`,description:'A sample description. '.repeat(3),category:cats[i%10],price:+(5+((i*37)%400)+0.99),brand:`Brand ${i%7}`,sku:`SKU-${i+1}`,width:10.5,height:12,depth:8,image_url:`${O}/img/${i+1}.svg`,thumbnail:`${O}/img/${i+1}.svg`})
const variants={
 clean:()=>Array.from({length:134},(_,i)=>base(i)),
 messy:()=>Array.from({length:134},(_,i)=>{const b=base(i);
   if(i%3===0){b.brand='';b.width='';b.height='';b.depth=''}
   if(i%4===0){b.brand=null;b.description=null;b.sku=null}
   if(i%5===0){b.price=String(b.price)}
   if(i%6===0){b.id=String(b.id)}
   if(i%7===0){delete b.image_url;delete b.thumbnail}
   if(i%8===0){b.category='Home Decoration'}
   if(i%9===0){b.width=String(b.width);b.depth=null}
   if(i%11===0){b.image_url='http://localhost:1/broken.webp';b.thumbnail='http://localhost:1/broken.webp'}
   return b}),
 wrapped:()=>({data:Array.from({length:134},(_,i)=>base(i))}),
 n8nitems:()=>Array.from({length:134},(_,i)=>({json:base(i)})),
}
let mode='clean'
http.createServer((q,r)=>{r.setHeader('Access-Control-Allow-Origin','*')
const u=new URL(q.url,O)
if(u.pathname==='/mode'){mode=u.searchParams.get('m');return r.end('ok '+mode)}
if(u.pathname.startsWith('/img/')){r.setHeader('content-type','image/svg+xml');return r.end('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#ccd"/></svg>')}
r.setHeader('content-type','application/json');r.end(JSON.stringify(variants[mode]()))}).listen(8787)
