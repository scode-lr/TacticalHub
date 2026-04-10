import{f as K,g as Z}from"./chunk-JRJP5AVA.js";import{b as _,d as r,e as J,h as ee,i as te}from"./chunk-Z6XAWFV3.js";import{ja as Y,ka as E,qa as M}from"./chunk-QNXT5467.js";import{a as W,d as X}from"./chunk-AB6MP44Z.js";import{$ as B,Aa as H,Fa as p,Fb as G,Ha as P,I as m,Ib as q,Ka as L,L as z,La as $,Ma as T,N as g,Na as C,Ra as j,Sa as s,U as v,Z as N,_ as y,ab as S,ba as x,ca as k,cb as O,da as A,ia as u,la as V,ma as R,pb as Q,ra as h,rb as l,sa as I,ta as F,u as D,ub as c,v as f,vb as U,w as b,x as w,z as o}from"./chunk-A62PN35E.js";var ne=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var ue=["handle"],he=["input"],pe=e=>({checked:e});function fe(e,se){e&1&&H(0)}function be(e,se){if(e&1&&A(0,fe,1,0,"ng-container",3),e&2){let n=P();h("ngTemplateOutlet",n.handleTemplate||n._handleTemplate)("ngTemplateOutletContext",O(2,pe,n.checked()))}}var we=`
    ${ne}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,me={root:{position:"relative"}},ve={root:({instance:e})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":e.checked(),"p-disabled":e.$disabled(),"p-invalid":e.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},ie=(()=>{class e extends M{name="toggleswitch";style=we;classes=ve;inlineStyles=me;static \u0275fac=(()=>{let n;return function(t){return(n||(n=g(e)))(t||e)}})();static \u0275prov=f({token:e,factory:e.\u0275fac})}return e})();var oe=new w("TOGGLESWITCH_INSTANCE"),ye={provide:W,useExisting:D(()=>ae),multi:!0},ae=(()=>{class e extends te{componentName="ToggleSwitch";$pcToggleSwitch=o(oe,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=o(r,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=l();ariaLabelledBy;autofocus;onChange=new m;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=o(ie);templates;onHostClick(n){this.onClick(n)}onAfterContentInit(){this.templates.forEach(n=>{n.getType()==="handle"?this._handleTemplate=n.template:this._handleTemplate=n.template})}onClick(n){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:n,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(n,i){i(n),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let n;return function(t){return(n||(n=g(e)))(t||e)}})();static \u0275cmp=N({type:e,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(i,t,a){if(i&1&&L(a,ue,4)(a,Y,4),i&2){let d;T(d=C())&&(t.handleTemplate=d.first),T(d=C())&&(t.templates=d)}},viewQuery:function(i,t){if(i&1&&$(he,5),i&2){let a;T(a=C())&&(t.input=a.first)}},hostVars:7,hostBindings:function(i,t){i&1&&p("click",function(d){return t.onHostClick(d)}),i&2&&(u("data-p-checked",t.checked())("data-p-disabled",t.$disabled())("data-p",t.dataP),j(t.sx("root")),s(t.cn(t.cx("root"),t.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",U],inputId:"inputId",readonly:[2,"readonly","readonly",c],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",c]},outputs:{onChange:"onChange"},features:[S([ye,ie,{provide:oe,useExisting:e},{provide:_,useExisting:e}]),x([r]),k],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,t){i&1&&(I(0,"input",1,0),p("focus",function(){return t.onFocus()})("blur",function(){return t.onBlur()}),F(),I(2,"div",2)(3,"div",2),V(4,be,1,4,"ng-container"),F()()),i&2&&(s(t.cx("input")),h("checked",t.checked())("pAutoFocus",t.autofocus)("pBind",t.ptm("input")),u("id",t.inputId)("required",t.required()?"":void 0)("disabled",t.$disabled()?"":void 0)("aria-checked",t.checked())("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel)("name",t.name())("tabindex",t.tabindex),v(2),s(t.cx("slider")),h("pBind",t.ptm("slider")),u("data-p",t.dataP),v(),s(t.cx("handle")),h("pBind",t.ptm("handle")),u("data-p",t.dataP),v(),R(t.handleTemplate||t._handleTemplate?4:-1))},dependencies:[q,G,K,E,J,r],encapsulation:2,changeDetection:0})}return e})(),Ge=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=y({type:e});static \u0275inj=b({imports:[ae,E,E]})}return e})();var re=`
    .p-textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-size: 1rem;
        color: dt('textarea.color');
        background: dt('textarea.background');
        padding-block: dt('textarea.padding.y');
        padding-inline: dt('textarea.padding.x');
        border: 1px solid dt('textarea.border.color');
        transition:
            background dt('textarea.transition.duration'),
            color dt('textarea.transition.duration'),
            border-color dt('textarea.transition.duration'),
            outline-color dt('textarea.transition.duration'),
            box-shadow dt('textarea.transition.duration');
        appearance: none;
        border-radius: dt('textarea.border.radius');
        outline-color: transparent;
        box-shadow: dt('textarea.shadow');
    }

    .p-textarea:enabled:hover {
        border-color: dt('textarea.hover.border.color');
    }

    .p-textarea:enabled:focus {
        border-color: dt('textarea.focus.border.color');
        box-shadow: dt('textarea.focus.ring.shadow');
        outline: dt('textarea.focus.ring.width') dt('textarea.focus.ring.style') dt('textarea.focus.ring.color');
        outline-offset: dt('textarea.focus.ring.offset');
    }

    .p-textarea.p-invalid {
        border-color: dt('textarea.invalid.border.color');
    }

    .p-textarea.p-variant-filled {
        background: dt('textarea.filled.background');
    }

    .p-textarea.p-variant-filled:enabled:hover {
        background: dt('textarea.filled.hover.background');
    }

    .p-textarea.p-variant-filled:enabled:focus {
        background: dt('textarea.filled.focus.background');
    }

    .p-textarea:disabled {
        opacity: 1;
        background: dt('textarea.disabled.background');
        color: dt('textarea.disabled.color');
    }

    .p-textarea::placeholder {
        color: dt('textarea.placeholder.color');
    }

    .p-textarea.p-invalid::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }

    .p-textarea-fluid {
        width: 100%;
    }

    .p-textarea-resizable {
        overflow: hidden;
        resize: none;
    }

    .p-textarea-sm {
        font-size: dt('textarea.sm.font.size');
        padding-block: dt('textarea.sm.padding.y');
        padding-inline: dt('textarea.sm.padding.x');
    }

    .p-textarea-lg {
        font-size: dt('textarea.lg.font.size');
        padding-block: dt('textarea.lg.padding.y');
        padding-inline: dt('textarea.lg.padding.x');
    }
`;var xe=`
    ${re}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,ke={root:({instance:e})=>["p-textarea p-component",{"p-filled":e.$filled(),"p-textarea-resizable ":e.autoResize,"p-variant-filled":e.$variant()==="filled","p-textarea-fluid":e.hasFluid,"p-inputfield-sm p-textarea-sm":e.pSize==="small","p-textarea-lg p-inputfield-lg":e.pSize==="large","p-invalid":e.invalid()}]},de=(()=>{class e extends M{name="textarea";style=xe;classes=ke;static \u0275fac=(()=>{let n;return function(t){return(n||(n=g(e)))(t||e)}})();static \u0275prov=f({token:e,factory:e.\u0275fac})}return e})();var le=new w("TEXTAREA_INSTANCE"),ct=(()=>{class e extends ee{componentName="Textarea";bindDirectiveInstance=o(r,{self:!0});$pcTextarea=o(le,{optional:!0,skipSelf:!0})??void 0;pTextareaPT=l();pTextareaUnstyled=l();autoResize;pSize;variant=l();fluid=l(void 0,{transform:c});invalid=l(void 0,{transform:c});$variant=Q(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new m;ngControlSubscription;_componentStyle=o(de);ngControl=o(X,{optional:!0,self:!0});pcFluid=o(Z,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}constructor(){super(),z(()=>{let n=this.pTextareaPT();n&&this.directivePT.set(n)}),z(()=>{this.pTextareaUnstyled()&&this.directiveUnstyled.set(this.pTextareaUnstyled())})}onInit(){this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}onAfterViewInit(){this.autoResize&&this.resize(),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(n){this.writeModelValue(n.target?.value),this.updateState()}resize(n){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(n||{})}updateState(){this.autoResize&&this.resize()}onDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe()}static \u0275fac=function(i){return new(i||e)};static \u0275dir=B({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(i,t){i&1&&p("input",function(d){return t.onInput(d)}),i&2&&s(t.cx("root"))},inputs:{pTextareaPT:[1,"pTextareaPT"],pTextareaUnstyled:[1,"pTextareaUnstyled"],autoResize:[2,"autoResize","autoResize",c],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[S([de,{provide:le,useExisting:e},{provide:_,useExisting:e}]),x([r]),k]})}return e})(),gt=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=y({type:e});static \u0275inj=b({})}return e})();export{ae as a,Ge as b,ct as c,gt as d};
