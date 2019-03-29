; /* /bitrix/js/ui/actionpanel/panel.min.js?154453437312578*/
; /* /bitrix/js/ui/actionpanel/item.min.js?15496277803083*/

; /* Start:"a:4:{s:4:"full";s:54:"/bitrix/js/ui/actionpanel/panel.min.js?154453437312578";s:6:"source";s:34:"/bitrix/js/ui/actionpanel/panel.js";s:3:"min";s:38:"/bitrix/js/ui/actionpanel/panel.min.js";s:3:"map";s:38:"/bitrix/js/ui/actionpanel/panel.map.js";}"*/
(function(){"use strict";BX.namespace("BX.UI");BX.UI.ActionPanel=function(e){this.groupActions=e.groupActions;this.layout={container:null,itemContainer:null,more:null,reset:null,totalSelected:null,totalSelectedItem:null};this.zIndex=e.zIndex;this.itemContainer=null;this.renderTo=e.renderTo;this.darkMode=e.darkMode;this.floatMode=typeof e.floatMode==="undefined"?true:e.floatMode;this.alignItems=e.alignItems;this.items=[];this.hiddenItems=[];this.grid=null;this.tileGrid=null;this.maxHeight=e.maxHeight;this.params=e.params||{};this.parentPosition=e.parentPosition;this.mutationObserver=null;this.panelIsFixed=null;this.removeLeftPosition=e.removeLeftPosition;this.pinnedMode=typeof e.pinnedMode==="undefined"?false:e.pinnedMode;this.autoHide=typeof e.autoHide==="undefined"?true:e.autoHide;this.showTotalSelectedBlock=typeof e.showTotalSelectedBlock==="undefined"?true:e.showTotalSelectedBlock;this.showResetAllBlock=typeof e.showResetAllBlock==="undefined"?this.pinnedMode?false:true:e.showResetAllBlock;this.buildPanelContainer();this.bindEvents();if(this.pinnedMode){this.buildPanelByGroup()}};BX.UI.ActionPanel.prototype={bindEvents:function(){if(this.params.tileGridId){BX.addCustomEvent("BX.TileGrid.Grid::ready",this.handleTileGridReady.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:selectItem",this.handleTileSelectItem.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:checkItem",this.handleTileSelectItem.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:unSelectItem",this.handleTileUnSelectItem.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:redraw",this.hidePanel.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:defineEscapeKey",this.hidePanel.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:lastSelectedItem",this.hidePanel.bind(this));BX.addCustomEvent(window,"BX.TileGrid.Grid:multiSelectModeOff",this.hidePanel.bind(this))}if(this.params.gridId){BX.addCustomEvent("Grid::ready",this.handleGridReady.bind(this));BX.addCustomEvent("Grid::thereSelectedRows",this.handleGridSelectItem.bind(this));BX.addCustomEvent("Grid::allRowsSelected",this.handleGridSelectItem.bind(this));BX.addCustomEvent("Grid::updated",this.hidePanel.bind(this));BX.addCustomEvent("Grid::noSelectedRows",this.hidePanel.bind(this));BX.addCustomEvent("Grid::allRowsUnselected",this.hidePanel.bind(this))}if(this.autoHide){BX.bind(window,"click",this.handleOuterClick.bind(this))}if(this.floatMode){BX.bind(window,"scroll",BX.throttle(this.handleScroll,50,this))}BX.addCustomEvent(this,"BX.UI.ActionPanel:clickResetAllBlock",this.hidePanel.bind(this));BX.bind(window,"resize",BX.throttle(this.handleResize,20,this));this.getMutationObserver().observe(document.body,this.getMutationObserverParam())},getMutationObserver:function(){if(this.mutationObserver)return this.mutationObserver;this.mutationObserver=new MutationObserver(function(){BX.throttle(this.adjustPanelStyle,20,this)}.bind(this));return this.mutationObserver},getMutationObserverParam:function(){return{attributes:true,characterData:true,childList:true,subtree:true,attributeOldValue:true,characterDataOldValue:true}},addItems:function(e){e.forEach(function(e){this.appendItem(e)}.bind(this));this.fillHiddenItems();if(this.hiddenItems.length>0&&!this.layout.more){this.appendMoreBlock()}},buildItem:function(e){e.actionPanel=this;return new BX.UI.ActionPanel.Item(e)},appendItem:function(e){var t=this.buildItem(e);this.items.push(t);this.layout.itemContainer.appendChild(t.render())},addHiddenItem:function(e){this.hiddenItems.push(e)},removeHiddenItem:function(e){for(var t=0;t<this.hiddenItems.length;t++){if(this.hiddenItems[t].id===e.id){delete this.hiddenItems[t];this.hiddenItems.splice(t,1);return}}},fillHiddenItems:function(){this.hiddenItems=[];this.items.forEach(function(e){if(e.isNotFit()){this.addHiddenItem(e)}},this)},removeItems:function(){this.items.forEach(function(e){e.destroy()});this.items=[];this.hiddenItems=[]},appendMoreBlock:function(){this.layout.more=BX.create("div",{props:{className:"ui-action-panel-more"},text:BX.message("JS_UI_ACTIONPANEL_MORE_BLOCK"),events:{click:this.handleClickMoreBlock.bind(this)}});this.layout.container.appendChild(this.layout.more);this.fillHiddenItems()},getResetAllBlock:function(){this.layout.reset=BX.create("div",{props:{className:"ui-action-panel-reset"}});this.removeLeftPosition?BX.addClass(this.layout.reset,"ui-action-panel-reset-ordert-first"):null;BX.bind(this.layout.reset,"click",function(){BX.onCustomEvent(this,"BX.UI.ActionPanel:clickResetAllBlock");this.resetAllSection()}.bind(this));return this.layout.reset},resetAllSection:function(){if(this.grid){this.grid.getRows().unselectAll()}else if(this.tileGrid){this.tileGrid.resetSetMultiSelectMode();this.tileGrid.resetSelectAllItems();this.tileGrid.resetFromToItems()}},handleScroll:function(){if(this.getDistanceFromTop()>0){if(this.panelIsFixed)this.unfixPanel()}else{if(!this.panelIsFixed)this.fixPanel()}var e=BX.PopupMenu.getMenuById("ui-action-panel-item-popup-menu");if(e){e.popupWindow.adjustPosition()}},handleOuterClick:function(e){var t=BX.getEventTarget(e);if(BX.hasClass(t,"ui-action-panel")){return}if(BX.findParent(t,{className:"ui-action-panel"})){return}if(BX.findParent(t,{className:"main-grid-container"})){return}if(BX.findParent(t,{className:"ui-grid-tile-item"})){return}if(BX.findParent(t,{className:"main-kanban-item"})){return}this.hidePanel();if(this.grid){this.resetAllSection()}},getMaxZindex:function(){var e=0;var t=document.getElementsByTagName("*");for(var i=0;i<t.length-1;i++){if(parseInt(t[i].style.zIndex)>e){e=parseInt(t[i].style.zIndex)}}return e},handleClickMoreBlock:function(e){var t=this.layout.more;var i=BX.PopupMenu.create("ui-action-panel-item-popup-menu",t,this.hiddenItems,{className:"ui-action-panel-item-popup-menu",angle:true,offsetLeft:t.offsetWidth/2,closeByEsc:true,zIndex:this.getMaxZindex()+1,events:{onPopupShow:function(){BX.bind(i.popupWindow.popupContainer,"click",function(e){var t=BX.getEventTarget(e);var n=BX.findParent(t,{className:"menu-popup-item"},10);if(!n||!n.dataset.preventCloseContextMenu){i.close()}})},onPopupClose:function(){i.destroy();BX.removeClass(t,"ui-action-panel-item-active")}}});i.layout.menuContainer.setAttribute("data-tile-grid","tile-grid-stop-close");i.show()},removeMoreBlock:function(){if(!this.layout.more)return;this.layout.more.parentNode.removeChild(this.layout.more);this.layout.more=null},getDistanceFromTop:function(){return this.resolveRenderContainer().getBoundingClientRect().top},fixPanel:function(){BX.addClass(this.layout.container,"ui-action-panel-fixed");this.panelIsFixed=true},unfixPanel:function(){BX.removeClass(this.layout.container,"ui-action-panel-fixed");this.panelIsFixed=null},buildPanelContainer:function(){this.layout.container=BX.create("div",{attrs:{className:this.darkMode?"ui-action-panel ui-action-panel-darkmode":"ui-action-panel"},dataset:{tileGrid:"tile-grid-stop-close"},children:[this.showTotalSelectedBlock?this.getTotalSelectedBlock():null,this.getItemContainer(),this.showResetAllBlock?this.getResetAllBlock():null]});this.maxHeight?this.layout.container.style.maxHeight=this.maxHeight+"px":null},getItemContainer:function(){return this.layout.itemContainer=BX.create("div",{props:{className:"ui-action-panel-wrapper"},style:{textAlign:this.alignItems?this.alignItems:null}})},getTotalSelectedBlock:function(){return this.layout.totalSelected=BX.create("div",{props:{className:this.removeLeftPosition?"ui-action-panel-total ui-action-panel-total-without-border":"ui-action-panel-total"},dataset:{role:"action-panel-total"},children:[BX.create("span",{props:{className:"ui-action-panel-total-label"},text:BX.message("JS_UI_ACTIONPANEL_IS_SELECTED")}),this.layout.totalSelectedItem=BX.create("span",{props:{className:"ui-action-panel-total-param"},dataset:{role:"action-panel-total-param"}})]})},getPanelContainer:function(){return this.layout.container},adjustPanelStyle:function(){var e=BX.pos(this.resolveRenderContainer());var t=0;if(this.maxHeight){t=e.height-this.maxHeight}this.layout.container.style.width=e.width+"px";this.layout.container.style.top=e.top+t+"px";this.panelIsFixed?this.layout.container.style.left=this.resolveRenderContainer().getBoundingClientRect().left+"px":this.layout.container.style.left=e.left+"px"},handleResize:function(){this.adjustPanelStyle();this.fillHiddenItems();if(this.hiddenItems.length>0){this.layout.more||this.appendMoreBlock()}else{!this.layout.more||this.removeMoreBlock()}},handleGridReady:function(e){if(!this.grid&&e.getContainerId()===this.params.gridId){this.grid=e}},handleTileGridReady:function(e){if(!this.tileGrid&&e.getId()===this.params.tileGridId){this.tileGrid=e}},handleGridUnSelectItem:function(e,t){if(t.getRows().getSelectedIds().length===1){this.buildPanelByItem(t.getRows().getSelected().pop())}},handleTileUnSelectItem:function(e,t){if(this.showTotalSelectedBlock){this.setTotalSelectedItems(t.getSelectedItems().length)}if(t.getSelectedItems().length===1){this.buildPanelByItem(t.getSelectedItems().pop())}},handleGridSelectItem:function(){if(this.showTotalSelectedBlock){this.setTotalSelectedItems(this.grid.getRows().getSelectedIds().length)}if(this.grid.getRows().getSelectedIds().length>1){this.buildPanelByGroup()}else{this.buildPanelByItem(this.grid.getRows().getSelected().pop())}},handleTileSelectItem:function(e,t){if(this.showTotalSelectedBlock){this.setTotalSelectedItems(t.getSelectedItems().length)}if(t.isMultiSelectMode()&&t.getSelectedItems().length>1){this.buildPanelByGroup()}else{this.buildPanelByItem(e)}},buildPanelByItem:function(e){var t=e.getActions();var i=[];t.forEach(function(e){if(!e.hideInActionPanel){i.push(e)}}.bind(this));this.removeItems();this.addItems(i);this.showPanel();if(this.hiddenItems.length<=0)this.removeMoreBlock()},buildPanelByGroup:function(){if(!this.groupActions){return}var e=this.extractButtonsFromGroupActions(this.groupActions);this.removeItems();this.addItems(e);this.showPanel()},setTotalSelectedItems:function(e){if(this.layout.totalSelectedItem){this.layout.totalSelectedItem.innerHTML=e}},extractButtonsFromGroupActions:function(e){var t=BX.clone(e);if(!t["GROUPS"]||!t["GROUPS"][0]||!t["GROUPS"][0]["ITEMS"]){return[]}var i=[];var n=t["GROUPS"][0]["ITEMS"];n.forEach(function(e){if(e.TYPE==="BUTTON"){var t=e.ONCHANGE.pop();if(t&&t.ACTION==="CALLBACK"){var n=t.DATA.pop();i.push({id:e.ID||e.VALUE,text:e.TEXT||e.NAME,icon:e.ICON,disabled:e.DISABLED,onclick:n.JS})}}else if(e.TYPE==="DROPDOWN"){i.push({id:e.ID||e.VALUE,text:e.TEXT||e.NAME,icon:e.ICON,submenuOptions:e.SUBMENU_OPTIONS||{},disabled:e.DISABLED,items:e.ITEMS})}});return i},showPanel:function(){if(this.pinnedMode){this.activatePanelItems()}if(BX.hasClass(this.layout.container,"ui-action-panel-show"))return;BX.addClass(this.layout.container,"ui-action-panel-show");BX.addClass(this.layout.container,"ui-action-panel-show-animate");var e=BX.pos(this.resolveRenderContainer());this.layout.container.style.height=e.height+"px";setTimeout(function(){BX.removeClass(this.layout.container,"ui-action-panel-show-animate")}.bind(this),300)},disableActionItems:function(){this.items.forEach(function(e){this.disableItem(e)},this)},hidePanel:function(){BX.onCustomEvent(this,"BX.UI.ActionPanel:hidePanel");if(this.pinnedMode){this.disablePanelItems();return}BX.removeClass(this.layout.container,"ui-action-panel-show");BX.removeClass(this.layout.container,"ui-action-panel-show-animate");BX.addClass(this.layout.container,"ui-action-panel-hide-animate");setTimeout(function(){BX.removeClass(this.layout.container,"ui-action-panel-hide-animate")}.bind(this),300)},activatePanelItems:function(){if(this.layout.totalSelected){this.layout.totalSelected.classList.remove("ui-action-panel-item-is-disabled")}},disablePanelItems:function(){this.disableActionItems();if(this.layout.totalSelected){this.layout.totalSelected.classList.add("ui-action-panel-item-is-disabled")}var e=document.querySelector('[data-role="action-panel-total-param"]');if(e){e.textContent="0"}},resolveRenderContainer:function(){if(BX.type.isDomNode(this.renderTo)){return this.renderTo}if(BX.type.isFunction(this.renderTo)){var e=this.renderTo.call();if(BX.type.isDomNode(e)){return e}}throw new Error("BX.UI.ActionPanel: 'this.renderTo' has to be DomNode or function which returns DomNode")},draw:function(){document.body.appendChild(this.getPanelContainer());this.adjustPanelStyle();if(this.pinnedMode){this.disablePanelItems()}setTimeout(function(){this.handleResize()}.bind(this))},disableItem:function(e){if(e){e.disable()}}}})();
/* End */
;
; /* Start:"a:4:{s:4:"full";s:52:"/bitrix/js/ui/actionpanel/item.min.js?15496277803083";s:6:"source";s:33:"/bitrix/js/ui/actionpanel/item.js";s:3:"min";s:37:"/bitrix/js/ui/actionpanel/item.min.js";s:3:"map";s:37:"/bitrix/js/ui/actionpanel/item.map.js";}"*/
(function(){"use strict";BX.namespace("BX.UI");BX.UI.ActionPanel.Item=function(t){this.id=t.id;this.type=t.type;this.text=t.text;this.icon=t.icon;this.submenuOptions={};if(t.submenuOptions&&BX.type.isString(t.submenuOptions)){try{this.submenuOptions=JSON.parse(t.submenuOptions)}catch(t){}}this.buttonIconClass=t.buttonIconClass;this.onclick=t.onclick;this.href=t.href;this.items=t.items;this.actionPanel=t.actionPanel;this.options=t;this.attributes=BX.prop.getObject(t,"attributes");this.disabled=t.disabled;this.layout={container:null,icon:null,text:null}};BX.UI.ActionPanel.Item.prototype={render:function(){var t;this.href?t="a":t="div";var i="ui-action-panel-item "+(this.disabled?"ui-action-panel-item-is-disabled":"");if(this.buttonIconClass){i="ui-btn ui-btn-lg ui-btn-link "+this.buttonIconClass}this.layout.container=BX.create(t,{props:{className:i},children:[this.icon?'<span class="ui-action-panel-item-icon"><img src="'+this.icon+'" title=" "></span>':null,this.text&&!this.buttonIconClass?'<span class="ui-action-panel-item-title">'+this.text+"</span>":this.text],attrs:this.attributes,dataset:{role:"action-panel-item"},events:{click:this.handleClick.bind(this)}});this.href?this.layout.container.setAttribute("href",this.href):null;this.href?this.layout.container.setAttribute("title",this.text):null;if(this.options.hide){this.hide()}return this.layout.container},show:function(){BX.show(this.layout.container,"block")},hide:function(){BX.hide(this.layout.container,"none")},destroy:function(){BX.remove(this.layout.container)},isVisible:function(){if(this.layout.container.offsetTop>8){return false}return true},isNotFit:function(){return this.layout.container.offsetHeight>0&&!this.isVisible()},handleClick:function(event){if(this.isDisabled()){event.preventDefault();return}if(this.items){this.openSubMenu()}else{if(BX.type.isString(this.onclick)){eval(this.onclick)}else if(BX.type.isFunction(this.onclick)){this.onclick.call(this,event,this)}}},isDisabled:function(){return this.disabled},disable:function(){this.disabled=true;if(this.layout&&this.layout.container){BX.data(this.layout.container,"slider-ignore-autobinding",true);this.layout.container.classList.add("ui-action-panel-item-is-disabled")}},enable:function(){this.disabled=false;if(this.layout&&this.layout.container){BX.data(this.layout.container,"slider-ignore-autobinding",false);this.layout.container.classList.remove("ui-action-panel-item-is-disabled")}},openSubMenu:function(){if(!this.items){return}var t=this.layout.container;var i={className:"ui-action-panel-item-popup-menu",angle:true,zIndex:this.actionPanel.zIndex?this.actionPanel.zIndex+1:null,offsetLeft:t.offsetWidth/2,closeByEsc:true,events:{onPopupClose:function(){e.destroy();BX.removeClass(t,"ui-action-panel-item-active")}}};i=BX.mergeEx(i,this.submenuOptions);var e=BX.PopupMenu.create("ui-action-panel-item-popup-menu",t,this.items,i);e.layout.menuContainer.setAttribute("data-tile-grid","tile-grid-stop-close");e.show();BX.addClass(this.layout.container,"ui-action-panel-item-active")}}})();
/* End */
;
//# sourceMappingURL=kernel_ui_actionpanel.map.js