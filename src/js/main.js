import{headerTemplate}from'./templates/header.js';import{bottomNavTemplate}from'./templates/bottom-nav.js';import{shoppingListTemplate}from'./templates/shopping-list.js';import{recipesTemplate}from'./templates/recipes.js';import{settingsTemplate}from'./templates/settings.js';
const $=id=>document.getElementById(id);const setView=tpl=>$('main-container').innerHTML=tpl;
document.addEventListener('DOMContentLoaded',()=>{
$('header-container').innerHTML=headerTemplate;$('bottom-nav-container').innerHTML=bottomNavTemplate;
setView(shoppingListTemplate);
$('nav-shopping').onclick=()=>setView(shoppingListTemplate);
$('nav-recipes').onclick=()=>setView(recipesTemplate);
$('nav-settings').onclick=()=>setView(settingsTemplate);
});
