import{l as s,x as t,y as n,E as r,G as l,F as g,C as p,D as c}from"./@vue-26db76b7.js";import{_}from"./index-5d8ccf7f.js";const d={props:["pages","getPerProduct"]},m={"aria-label":"Page navigation example",class:"my-5"},u={class:"pagination justify-content-center"},k={key:0,class:"page-link"},f=["onClick"];function v(o,i,e,h,P,y){return s(),t("nav",m,[n("ul",u,[n("li",{class:r(["page-item",{disabled:!e.pages.has_pre}])},[n("a",{href:"#",class:"page-link",onClick:i[0]||(i[0]=l(a=>o.$emit("change-page",e.pages.current_page-1),["prevent"]))},"Previous")],2),(s(!0),t(g,null,p(e.pages.total_pages,a=>(s(),t("li",{class:r(["page-item",{active:a===e.pages.current_page}]),key:a+"pageNum"},[a===e.pages.current_page?(s(),t("span",k,c(a),1)):(s(),t("a",{key:1,class:"page-link",href:"#",onClick:l(C=>e.getPerProduct(a),["prevent"])},c(a),9,f))],2))),128)),n("li",{href:"#",class:r(["page-item",{disabled:!e.pages.has_next}])},[n("a",{class:"page-link",onClick:i[1]||(i[1]=l(a=>o.$emit("change-page",e.pages.current_page+1),["prevent"]))},"Next")],2)])])}const B=_(d,[["render",v]]);export{B as P};
