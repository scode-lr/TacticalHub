import{e as Fe,f as Me,g as Se,h as Ie}from"./chunk-RFVCLCIL.js";import{C as ke,D as Te,a as ye,f as _e,q as Ce,r as we}from"./chunk-ISJ3SLLW.js";import{b as B,d as be,e as xe,f,g as ve}from"./chunk-6A62W3RV.js";import{a as Q}from"./chunk-7MAD6IOH.js";import{a as fe}from"./chunk-JJZGUB5B.js";import{ja as me,ka as N,qa as A}from"./chunk-SS4MGYQA.js";import{a as de,c as se,e as ce,f as pe,j as ue,k as ge,u as he}from"./chunk-C5JRHPJ2.js";import{$a as j,Aa as V,Ab as oe,B as U,Ba as H,C as k,Ca as l,Cb as u,D as T,Da as c,E as F,Ea as p,Fa as m,Fb as _,G as h,Gb as re,La as Y,Q as M,Qa as w,Qb as ae,Sa as r,T as R,Tb as le,V as C,Va as J,Wa as K,Xa as P,Ya as z,ab as Z,ba as a,bb as v,cb as y,db as L,eb as q,ia as S,ja as I,ka as G,lb as O,ma as D,mb as ee,na as E,nb as te,oa as W,ta as x,ub as ie,vb as ne,wa as d,xa as s,za as X}from"./chunk-347HTX4S.js";var De=`
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
`;var He=`
    ${De}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,je={root:({instance:e})=>["p-textarea p-component",{"p-filled":e.$filled(),"p-textarea-resizable ":e.autoResize,"p-variant-filled":e.$variant()==="filled","p-textarea-fluid":e.hasFluid,"p-inputfield-sm p-textarea-sm":e.pSize==="small","p-textarea-lg p-inputfield-lg":e.pSize==="large","p-invalid":e.invalid()}]},Ee=(()=>{class e extends A{name="textarea";style=He;classes=je;static \u0275fac=(()=>{let t;return function(n){return(t||(t=C(e)))(n||e)}})();static \u0275prov=k({token:e,factory:e.\u0275fac})}return e})();var Pe=new F("TEXTAREA_INSTANCE"),Oe=(()=>{class e extends be{componentName="Textarea";bindDirectiveInstance=h(f,{self:!0});$pcTextarea=h(Pe,{optional:!0,skipSelf:!0})??void 0;pTextareaPT=u();pTextareaUnstyled=u();autoResize;pSize;variant=u();fluid=u(void 0,{transform:_});invalid=u(void 0,{transform:_});$variant=oe(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new M;ngControlSubscription;_componentStyle=h(Ee);ngControl=h(ce,{optional:!0,self:!0});pcFluid=h(ye,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}constructor(){super(),R(()=>{let t=this.pTextareaPT();t&&this.directivePT.set(t)}),R(()=>{this.pTextareaUnstyled()&&this.directiveUnstyled.set(this.pTextareaUnstyled())})}onInit(){this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}onAfterViewInit(){this.autoResize&&this.resize(),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(t){this.writeModelValue(t.target?.value),this.updateState()}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{})}updateState(){this.autoResize&&this.resize()}onDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe()}static \u0275fac=function(i){return new(i||e)};static \u0275dir=G({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(i,n){i&1&&w("input",function(b){return n.onInput(b)}),i&2&&v(n.cx("root"))},inputs:{pTextareaPT:[1,"pTextareaPT"],pTextareaUnstyled:[1,"pTextareaUnstyled"],autoResize:[2,"autoResize","autoResize",_],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[O([Ee,{provide:Pe,useExisting:e},{provide:B,useExisting:e}]),D([f]),E]})}return e})(),Ne=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=I({type:e});static \u0275inj=T({})}return e})();var Ae=`
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
`;var qe=["handle"],Qe=["input"],Ue=e=>({checked:e});function Ge(e,o){e&1&&Y(0)}function We(e,o){if(e&1&&W(0,Ge,1,0,"ng-container",3),e&2){let t=r();l("ngTemplateOutlet",t.handleTemplate||t._handleTemplate)("ngTemplateOutletContext",te(2,Ue,t.checked()))}}var Xe=`
    ${Ae}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,Ye={root:{position:"relative"}},Je={root:({instance:e})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":e.checked(),"p-disabled":e.$disabled(),"p-invalid":e.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},Be=(()=>{class e extends A{name="toggleswitch";style=Xe;classes=Je;inlineStyles=Ye;static \u0275fac=(()=>{let t;return function(n){return(t||(t=C(e)))(n||e)}})();static \u0275prov=k({token:e,factory:e.\u0275fac})}return e})();var $e=new F("TOGGLESWITCH_INSTANCE"),Ke={provide:de,useExisting:U(()=>$),multi:!0},$=(()=>{class e extends xe{componentName="ToggleSwitch";$pcToggleSwitch=h($e,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=h(f,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=u();ariaLabelledBy;autofocus;onChange=new M;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=h(Be);templates;onHostClick(t){this.onClick(t)}onAfterContentInit(){this.templates.forEach(t=>{t.getType()==="handle"?this._handleTemplate=t.template:this._handleTemplate=t.template})}onClick(t){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:t,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(t,i){i(t),this.cd.markForCheck()}get dataP(){return this.cn({checked:this.checked(),disabled:this.$disabled(),invalid:this.invalid()})}static \u0275fac=(()=>{let t;return function(n){return(t||(t=C(e)))(n||e)}})();static \u0275cmp=S({type:e,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(i,n,g){if(i&1&&J(g,qe,4)(g,me,4),i&2){let b;P(b=z())&&(n.handleTemplate=b.first),P(b=z())&&(n.templates=b)}},viewQuery:function(i,n){if(i&1&&K(Qe,5),i&2){let g;P(g=z())&&(n.input=g.first)}},hostVars:7,hostBindings:function(i,n){i&1&&w("click",function(b){return n.onHostClick(b)}),i&2&&(x("data-p-checked",n.checked())("data-p-disabled",n.$disabled())("data-p",n.dataP),Z(n.sx("root")),v(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",re],inputId:"inputId",readonly:[2,"readonly","readonly",_],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",_]},outputs:{onChange:"onChange"},features:[O([Ke,Be,{provide:$e,useExisting:e},{provide:B,useExisting:e}]),D([f]),E],decls:5,vars:22,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus","pBind"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(i,n){i&1&&(c(0,"input",1,0),w("focus",function(){return n.onFocus()})("blur",function(){return n.onBlur()}),p(),c(2,"div",2)(3,"div",2),d(4,We,1,4,"ng-container"),p()()),i&2&&(v(n.cx("input")),l("checked",n.checked())("pAutoFocus",n.autofocus)("pBind",n.ptm("input")),x("id",n.inputId)("required",n.required()?"":void 0)("disabled",n.$disabled()?"":void 0)("aria-checked",n.checked())("aria-labelledby",n.ariaLabelledBy)("aria-label",n.ariaLabel)("name",n.name())("tabindex",n.tabindex),a(2),v(n.cx("slider")),l("pBind",n.ptm("slider")),x("data-p",n.dataP),a(),v(n.cx("handle")),l("pBind",n.ptm("handle")),x("data-p",n.dataP),a(),s(n.handleTemplate||n._handleTemplate?4:-1))},dependencies:[le,ae,_e,N,ve,f],encapsulation:2,changeDetection:0})}return e})(),Re=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=I({type:e});static \u0275inj=T({imports:[$,N,N]})}return e})();var et=()=>[],tt=(e,o)=>o.id;function it(e,o){e&1&&(c(0,"span",11),y(1,"*"),p())}function nt(e,o){if(e&1&&(c(0,"label",2),y(1),d(2,it,2,0,"span",11),p()),e&2){let t=r().$implicit;l("for",t.key),a(),q(" ",t.label," "),a(),s(t.isRequired?2:-1)}}function ot(e,o){if(e&1&&(c(0,"p",3),y(1),p()),e&2){let t=r().$implicit;a(),L(t.description)}}function rt(e,o){if(e&1&&m(0,"input",4),e&2){let t=r().$implicit,i=r();l("id",t.key)("formControl",i.form().get(t.key))("invalid",i.isFieldInvalid(t)),x("maxlength",t.maxLength)}}function at(e,o){if(e&1&&m(0,"input",5),e&2){let t=r().$implicit,i=r();l("id",t.key)("formControl",i.form().get(t.key))("invalid",i.isFieldInvalid(t))}}function lt(e,o){if(e&1&&m(0,"p-datepicker",6),e&2){let t=r().$implicit,i=r();l("inputId",t.key)("formControl",i.form().get(t.key))("fluid",!0)("showIcon",!0)("invalid",i.isFieldInvalid(t))}}function dt(e,o){if(e&1&&m(0,"input",7),e&2){let t=r().$implicit,i=r();l("id",t.key)("formControl",i.form().get(t.key))("invalid",i.isFieldInvalid(t))}}function st(e,o){if(e&1&&m(0,"input",8),e&2){let t=r().$implicit,i=r();l("id",t.key)("formControl",i.form().get(t.key))("invalid",i.isFieldInvalid(t))}}function ct(e,o){if(e&1&&m(0,"textarea",9),e&2){let t=r().$implicit,i=r();l("id",t.key)("formControl",i.form().get(t.key))("invalid",i.isFieldInvalid(t)),x("maxlength",t.maxLength)}}function pt(e,o){if(e&1&&(c(0,"div",15),m(1,"p-radiobutton",16),c(2,"label",17),y(3),p()()),e&2){let t=o.$implicit,i=r(3).$implicit,n=r();a(),l("inputId",i.key+"_"+t)("formControl",n.form().get(i.key))("name",i.key)("value",t),a(),l("for",i.key+"_"+t),a(),L(t)}}function ut(e,o){if(e&1&&(c(0,"div",14),V(1,pt,4,6,"div",15,X),p()),e&2){let t=r(2).$implicit,i=r();j("radio-group--error",i.isFieldInvalid(t)),a(),H(t.options)}}function gt(e,o){e&1&&(c(0,"span",11),y(1,"*"),p())}function ht(e,o){if(e&1&&(c(0,"label",13),m(1,"p-toggleswitch",18),c(2,"span",19),y(3),d(4,gt,2,0,"span",11),p()()),e&2){let t=r(2).$implicit,i=r();a(),l("formControl",i.form().get(t.key)),a(2),q(" ",t.label," "),a(),s(t.isRequired?4:-1)}}function mt(e,o){if(e&1&&d(0,ut,3,2,"div",12)(1,ht,5,3,"label",13),e&2){let t=r().$implicit;s(t.options!=null&&t.options.length?0:1)}}function ft(e,o){if(e&1&&(m(0,"p-select",10),ie(1,"translate")),e&2){let t=r().$implicit,i=r();l("inputId",t.key)("formControl",i.form().get(t.key))("options",t.options??ee(8,et))("fluid",!0)("invalid",i.isFieldInvalid(t))("placeholder",ne(1,6,"common.selectOption"))}}function bt(e,o){if(e&1&&(c(0,"div",1),d(1,nt,3,3,"label",2),d(2,ot,2,1,"p",3),d(3,rt,1,4,"input",4),d(4,at,1,3,"input",5),d(5,lt,1,5,"p-datepicker",6),d(6,dt,1,3,"input",7),d(7,st,1,3,"input",8),d(8,ct,1,4,"textarea",9),d(9,mt,2,1),d(10,ft,2,9,"p-select",10),p()),e&2){let t=o.$implicit,i=r();j("field-group--boolean",t.type==="boolean"&&!(t.options!=null&&t.options.length))("field-group--approved",t.status===i.AppStatus.Approved)("field-group--rejected",t.status===i.AppStatus.Rejected),a(),s(t.type!=="boolean"||t.options!=null&&t.options.length?1:-1),a(),s(t.description?2:-1),a(),s(t.type==="text"?3:-1),a(),s(t.type==="number"?4:-1),a(),s(t.type==="date"?5:-1),a(),s(t.type==="email"?6:-1),a(),s(t.type==="phone"?7:-1),a(),s(t.type==="textarea"?8:-1),a(),s(t.type==="boolean"?9:-1),a(),s(t.type==="select"?10:-1)}}var vi=(()=>{let o=class o{constructor(){this.fields=u.required(),this.form=u.required(),this.fieldStates=u({}),this.AppStatus=Q}isFieldInvalid(i){let n=this.form().get(i.key);return console.log("ctrl",this.form()),console.log("fieldStates",this.fieldStates()),!!(n?.invalid&&n?.touched)||i.status===Q.Rejected}};o.\u0275fac=function(n){return new(n||o)},o.\u0275cmp=S({type:o,selectors:[["app-dynamic-form-fields"]],inputs:{fields:[1,"fields"],form:[1,"form"],fieldStates:[1,"fieldStates"]},decls:2,vars:0,consts:[[1,"field-group",3,"field-group--boolean","field-group--approved","field-group--rejected"],[1,"field-group"],[1,"field-label",3,"for"],[1,"field-hint"],["pInputText","","type","text",3,"id","formControl","invalid"],["pInputText","","type","number",3,"id","formControl","invalid"],["dateFormat","dd/mm/yy","appendTo","body",3,"inputId","formControl","fluid","showIcon","invalid"],["pInputText","","type","email",3,"id","formControl","invalid"],["pInputText","","type","tel",3,"id","formControl","invalid"],["pTextarea","","rows","4",3,"id","formControl","invalid"],["appendTo","body",3,"inputId","formControl","options","fluid","invalid","placeholder"],[1,"required-mark"],[1,"radio-group",3,"radio-group--error"],[1,"boolean-label"],[1,"radio-group"],[1,"radio-option"],[3,"inputId","formControl","name","value"],[1,"radio-text",3,"for"],[3,"formControl"],[1,"boolean-text"]],template:function(n,g){n&1&&V(0,bt,11,16,"div",0,tt),n&2&&H(g.fields())},dependencies:[he,se,ue,pe,ge,we,Ce,Ne,Oe,Te,ke,Me,Fe,Re,$,Ie,Se,fe],styles:["[_nghost-%COMP%]{display:flex;flex-direction:column;gap:1.25rem}.field-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.375rem}.field-group--approved[_ngcontent-%COMP%]{border-left:3px solid var(--ion-color-success, #16a34a);padding-left:.625rem;border-radius:0 6px 6px 0}.field-group--approved[_ngcontent-%COMP%]   .field-label[_ngcontent-%COMP%]{color:var(--ion-color-success, #16a34a)}.field-group--rejected[_ngcontent-%COMP%]{border-left:3px solid var(--ion-color-danger, #dc2626);padding-left:.625rem;border-radius:0 6px 6px 0}.field-group--rejected[_ngcontent-%COMP%]   .field-label[_ngcontent-%COMP%]{color:var(--ion-color-danger, #dc2626)}.field-group--boolean[_ngcontent-%COMP%]{flex-direction:row;align-items:center;gap:0;padding:.875rem 1rem;border:1px solid var(--border-light, #e5e7eb);border-radius:10px;background:var(--background-primary, #ffffff);cursor:pointer;transition:border-color .2s ease}.field-group--boolean[_ngcontent-%COMP%]:hover{border-color:var(--ion-color-primary, #3880ff)}.field-label[_ngcontent-%COMP%]{font-size:.875rem;font-weight:600;color:var(--text-primary, #111827)}.required-mark[_ngcontent-%COMP%]{color:var(--ion-color-danger, #eb445a);margin-left:.125rem}.field-hint[_ngcontent-%COMP%]{margin:0 0 .125rem;font-size:.8125rem;color:var(--text-secondary, #6b7280);line-height:1.4}input[pInputText][_ngcontent-%COMP%], textarea[pTextarea][_ngcontent-%COMP%]{width:100%}p-select[_ngcontent-%COMP%], p-datepicker[_ngcontent-%COMP%]{width:100%}.boolean-label[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.75rem;width:100%;cursor:pointer}.boolean-text[_ngcontent-%COMP%]{font-size:.9375rem;font-weight:500;color:var(--text-primary, #111827)}.radio-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.5rem;padding:.75rem 1rem;border:1px solid var(--border-light, #e5e7eb);border-radius:10px;background:var(--background-primary, #ffffff);transition:border-color .2s ease}.radio-group--error[_ngcontent-%COMP%]{border-color:var(--ion-color-danger, #eb445a);background:var(--background-danger-subtle, #fef2f2)}.radio-option[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.625rem;padding:.375rem 0;cursor:pointer}.radio-option[_ngcontent-%COMP%]:not(:last-child){border-bottom:1px solid var(--border-light, #e5e7eb);padding-bottom:.625rem}.radio-text[_ngcontent-%COMP%]{font-size:.9375rem;font-weight:400;color:var(--text-primary, #111827);line-height:1.4;cursor:pointer}"]});let e=o;return e})();export{vi as a};
