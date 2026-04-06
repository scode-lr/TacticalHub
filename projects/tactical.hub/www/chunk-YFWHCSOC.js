import{b as z,c as ae,d as m,e as oe,f as re,i as le,k as de,l as se,m as pe,n as ce}from"./chunk-ZCKOEJI2.js";import{a as ne}from"./chunk-WV4PTNDQ.js";import{a as fe}from"./chunk-QPQGGL6P.js";import"./chunk-UREMBY3I.js";import{a as ie}from"./chunk-Y7U34PFL.js";import{ia as O,oa as P}from"./chunk-TYW4NVLL.js";import"./chunk-QK5XYHAC.js";import{a as te}from"./chunk-VXS77VU3.js";import"./chunk-BLCVOSDX.js";import{e as Q,f as W,h as Z,v as ee}from"./chunk-OTNMZSPV.js";import"./chunk-U7TETOAS.js";import{$ as S,Ga as U,Gb as J,Hb as k,I as L,Ia as b,Ja as G,K as B,Ka as X,L as A,N as v,Ta as E,U as n,Ua as s,Va as p,_ as I,aa as $,bb as w,ca as T,da as _,fc as K,kb as u,lb as g,ma as D,mb as Y,na as N,pb as q,qa as H,ra as V,rb as x,sa as c,ta as o,ua as d,ub as F,v as y,va as f,w as C,x as M,z as l}from"./chunk-GYHWJ7UU.js";import"./chunk-IOYOJE5H.js";import"./chunk-J2MNKKDW.js";import"./chunk-5E2TU5QO.js";import"./chunk-CJVXPTUK.js";import"./chunk-GITHW5CB.js";import"./chunk-UMTGL7G3.js";import"./chunk-YUNOCBLG.js";import"./chunk-VGMJM2GZ.js";import"./chunk-2NIBOUWM.js";import"./chunk-I547WOKC.js";import"./chunk-BJ43HUSB.js";import"./chunk-PXRN3JVL.js";import"./chunk-NMFL75IO.js";import{d as j}from"./chunk-4CLCTAJ7.js";var ue=`
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
`;var Te=`
    ${ue}

    /* For PrimeNG */
    .p-textarea.ng-invalid.ng-dirty {
        border-color: dt('textarea.invalid.border.color');
    }
    .p-textarea.ng-invalid.ng-dirty::placeholder {
        color: dt('textarea.invalid.placeholder.color');
    }
`,_e={root:({instance:e})=>["p-textarea p-component",{"p-filled":e.$filled(),"p-textarea-resizable ":e.autoResize,"p-variant-filled":e.$variant()==="filled","p-textarea-fluid":e.hasFluid,"p-inputfield-sm p-textarea-sm":e.pSize==="small","p-textarea-lg p-inputfield-lg":e.pSize==="large","p-invalid":e.invalid()}]},me=(()=>{class e extends P{name="textarea";style=Te;classes=_e;static \u0275fac=(()=>{let t;return function(a){return(t||(t=v(e)))(a||e)}})();static \u0275prov=y({token:e,factory:e.\u0275fac})}return e})();var be=new M("TEXTAREA_INSTANCE"),xe=(()=>{class e extends le{componentName="Textarea";bindDirectiveInstance=l(m,{self:!0});$pcTextarea=l(be,{optional:!0,skipSelf:!0})??void 0;pTextareaPT=x();pTextareaUnstyled=x();autoResize;pSize;variant=x();fluid=x(void 0,{transform:F});invalid=x(void 0,{transform:F});$variant=q(()=>this.variant()||this.config.inputStyle()||this.config.inputVariant());onResize=new L;ngControlSubscription;_componentStyle=l(me);ngControl=l(Q,{optional:!0,self:!0});pcFluid=l(re,{optional:!0,host:!0,skipSelf:!0});get hasFluid(){return this.fluid()??!!this.pcFluid}constructor(){super(),A(()=>{let t=this.pTextareaPT();t&&this.directivePT.set(t)}),A(()=>{this.pTextareaUnstyled()&&this.directiveUnstyled.set(this.pTextareaUnstyled())})}onInit(){this.ngControl&&(this.ngControlSubscription=this.ngControl.valueChanges.subscribe(()=>{this.updateState()}))}onAfterViewInit(){this.autoResize&&this.resize(),this.cd.detectChanges()}onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"])),this.autoResize&&this.resize(),this.writeModelValue(this.ngControl?.value??this.el.nativeElement.value)}onInput(t){this.writeModelValue(t.target?.value),this.updateState()}resize(t){this.el.nativeElement.style.height="auto",this.el.nativeElement.style.height=this.el.nativeElement.scrollHeight+"px",parseFloat(this.el.nativeElement.style.height)>=parseFloat(this.el.nativeElement.style.maxHeight)?(this.el.nativeElement.style.overflowY="scroll",this.el.nativeElement.style.height=this.el.nativeElement.style.maxHeight):this.el.nativeElement.style.overflow="hidden",this.onResize.emit(t||{})}updateState(){this.autoResize&&this.resize()}onDestroy(){this.ngControlSubscription&&this.ngControlSubscription.unsubscribe()}static \u0275fac=function(i){return new(i||e)};static \u0275dir=$({type:e,selectors:[["","pTextarea",""],["","pInputTextarea",""]],hostVars:2,hostBindings:function(i,a){i&1&&U("input",function(Ie){return a.onInput(Ie)}),i&2&&E(a.cx("root"))},inputs:{pTextareaPT:[1,"pTextareaPT"],pTextareaUnstyled:[1,"pTextareaUnstyled"],autoResize:[2,"autoResize","autoResize",F],pSize:"pSize",variant:[1,"variant"],fluid:[1,"fluid"],invalid:[1,"invalid"]},outputs:{onResize:"onResize"},features:[w([me,{provide:be,useExisting:e},{provide:z,useExisting:e}]),T([m]),_]})}return e})(),ve=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=S({type:e});static \u0275inj=C({})}return e})();var he=`
    .p-iftalabel {
        display: block;
        position: relative;
    }

    .p-iftalabel label {
        position: absolute;
        pointer-events: none;
        top: dt('iftalabel.top');
        transition-property: all;
        transition-timing-function: ease;
        line-height: 1;
        font-size: dt('iftalabel.font.size');
        font-weight: dt('iftalabel.font.weight');
        inset-inline-start: dt('iftalabel.position.x');
        color: dt('iftalabel.color');
        transition-duration: dt('iftalabel.transition.duration');
    }

    .p-iftalabel .p-inputtext,
    .p-iftalabel .p-textarea,
    .p-iftalabel .p-select-label,
    .p-iftalabel .p-multiselect-label,
    .p-iftalabel .p-multiselect-label:has(.p-chip),
    .p-iftalabel .p-autocomplete-input-multiple,
    .p-iftalabel .p-cascadeselect-label,
    .p-iftalabel .p-treeselect-label {
        padding-block-start: dt('iftalabel.input.padding.top');
        padding-block-end: dt('iftalabel.input.padding.bottom');
    }

    .p-iftalabel:has(.p-invalid) label {
        color: dt('iftalabel.invalid.color');
    }

    .p-iftalabel:has(input:focus) label,
    .p-iftalabel:has(input:-webkit-autofill) label,
    .p-iftalabel:has(textarea:focus) label,
    .p-iftalabel:has(.p-inputwrapper-focus) label {
        color: dt('iftalabel.focus.color');
    }

    .p-iftalabel .p-inputicon {
        top: dt('iftalabel.input.padding.top');
        transform: translateY(25%);
        margin-top: 0;
    }
`;var Ne=["*"],Ee=`
    ${he}

    /* For PrimeNG */
    .p-iftalabel:has(.ng-invalid.ng-dirty) label {
        color: dt('iftalabel.invalid.color');
    }
`,we={root:"p-iftalabel"},ye=(()=>{class e extends P{name="iftalabel";style=Ee;classes=we;static \u0275fac=(()=>{let t;return function(a){return(t||(t=v(e)))(a||e)}})();static \u0275prov=y({token:e,factory:e.\u0275fac})}return e})();var Ce=new M("IFTALABEL_INSTANCE"),R=(()=>{class e extends ae{componentName="IftaLabel";_componentStyle=l(ye);$pcIftaLabel=l(Ce,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=l(m,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}static \u0275fac=(()=>{let t;return function(a){return(t||(t=v(e)))(a||e)}})();static \u0275cmp=I({type:e,selectors:[["p-iftalabel"],["p-iftaLabel"],["p-ifta-label"]],hostVars:2,hostBindings:function(i,a){i&2&&E(a.cx("root"))},features:[w([ye,{provide:Ce,useExisting:e},{provide:z,useExisting:e}]),T([m]),_],ngContentSelectors:Ne,decls:1,vars:0,template:function(i,a){i&1&&(G(),X(0))},dependencies:[oe],encapsulation:2,changeDetection:0})}return e})(),Me=(()=>{class e{static \u0275fac=function(i){return new(i||e)};static \u0275mod=S({type:e});static \u0275inj=C({imports:[R,k,O,K,O]})}return e})();var ke=(e,r)=>r.fieldId;function Pe(e,r){e&1&&f(0,"div",3)}function ze(e,r){if(e&1&&(o(0,"p-iftalabel",16)(1,"textarea",18),s(2),d(),o(3,"label",19),s(4),d()()),e&2){let t=b().$implicit,i=b(2);n(),c("id","field-"+t.fieldId),n(),p(i.getDisplayValue(t)),n(),c("for","field-"+t.fieldId),n(),p(t.fieldLabel)}}function Be(e,r){if(e&1&&(o(0,"div",17),f(1,"p-checkbox",20),o(2,"label",21),s(3),d()()),e&2){let t=b().$implicit;n(),c("ngModel",t.valueBoolean)("binary",!0)("disabled",!0)("inputId","field-"+t.fieldId),n(),c("for","field-"+t.fieldId),n(),p(t.fieldLabel)}}function Ae(e,r){if(e&1&&(o(0,"p-iftalabel",16),f(1,"input",22),o(2,"label",19),s(3),d()()),e&2){let t=b().$implicit,i=b(2);n(),c("id","field-"+t.fieldId)("value",i.getDisplayValue(t)),n(),c("for","field-"+t.fieldId),n(),p(t.fieldLabel)}}function Oe(e,r){if(e&1&&D(0,ze,5,4,"p-iftalabel",16)(1,Be,4,6,"div",17)(2,Ae,4,4,"p-iftalabel",16),e&2){let t=r.$implicit;N(t.fieldType==="textarea"?0:t.fieldType==="boolean"?1:2)}}function Re(e,r){if(e&1&&(o(0,"div",4)(1,"div",5)(2,"div",6)(3,"h2",7),s(4),u(5,"translate"),d()(),o(6,"div",8)(7,"div",9)(8,"p-iftalabel"),f(9,"input",10),o(10,"label",11),s(11),u(12,"translate"),d()(),o(13,"p-iftalabel"),f(14,"input",12),o(15,"label",13),s(16),u(17,"translate"),d()(),o(18,"p-iftalabel"),f(19,"input",14),u(20,"date"),o(21,"label",15),s(22),u(23,"translate"),d()()()()(),o(24,"div",5)(25,"div",6)(26,"h2",7),s(27),u(28,"translate"),d()(),o(29,"div",8),H(30,Oe,3,1,null,null,ke),d()()()),e&2){let t=b();n(4),p(g(5,8,"admin.forms.submissionDetail.sectionInfo")),n(5),c("value",t.submission().formName),n(2),p(g(12,10,"admin.forms.submissionDetail.formName")),n(3),c("value",t.submission().userName),n(2),p(g(17,12,"admin.forms.submissionDetail.userName")),n(3),c("value",Y(20,14,t.submission().submittedAt,"dd/MM/yyyy HH:mm")),n(3),p(g(23,17,"admin.forms.submissionDetail.submittedAt")),n(5),p(g(28,19,"admin.forms.submissionDetail.sectionValues")),n(3),V(t.submission().values)}}var wt=(()=>{let r=class r{constructor(){this.formSubmissionsService=l(ne),this.navigationService=l(te),this.submission=B(null),this.loading=B(!0)}ngOnInit(){return j(this,null,function*(){let i=Number(this.navigationService.findRouteParam("idSubmision"));if(i)try{let a=yield this.formSubmissionsService.getSubmission(i);this.submission.set(a)}finally{this.loading.set(!1)}})}getDisplayValue(i){return i.valueText!==null?i.valueText:i.valueNumber!==null?String(i.valueNumber):i.valueDate!==null?i.valueDate:"\u2014"}};r.\u0275fac=function(a){return new(a||r)},r.\u0275cmp=I({type:r,selectors:[["app-forms-submission-detail"]],decls:8,vars:5,consts:[[1,"page-container"],[1,"section-header-with-back-button"],[1,"section-title"],[1,"loading-state"],[1,"detail-form"],[1,"form-card"],[1,"form-card-header"],[1,"card-section-title"],[1,"form-card-body"],[1,"field-row"],["pInputText","","id","formName","disabled","",3,"value"],["for","formName"],["pInputText","","id","userName","disabled","",3,"value"],["for","userName"],["pInputText","","id","submittedAt","disabled","",3,"value"],["for","submittedAt"],[1,"full-width"],[1,"checkbox-field"],["pTextarea","","disabled","","rows","3",3,"id"],[3,"for"],[3,"ngModel","binary","disabled","inputId"],[1,"checkbox-label",3,"for"],["pInputText","","disabled","",3,"id","value"]],template:function(a,h){a&1&&(o(0,"div",0)(1,"div",1),f(2,"app-back-button"),o(3,"h1",2),s(4),u(5,"translate"),d()(),D(6,Pe,1,0,"div",3),D(7,Re,32,21,"div",4),d()),a&2&&(n(4),p(g(5,3,"admin.forms.submissionDetail.title")),n(2),N(h.loading()?6:-1),n(),N(!h.loading()&&h.submission()?7:-1))},dependencies:[k,ee,W,Z,fe,ce,pe,ve,xe,se,de,Me,R,J,ie],styles:[".detail-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.5rem}.form-card[_ngcontent-%COMP%]{background:var(--background-primary, #ffffff);border:1px solid var(--border-light, #e5e7eb);border-radius:12px;overflow:hidden}.form-card-header[_ngcontent-%COMP%]{padding:1rem 1.5rem;border-bottom:1px solid var(--border-light, #e5e7eb)}.card-section-title[_ngcontent-%COMP%]{margin:0;font-size:.75rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--text-secondary, #6b7280)}.form-card-body[_ngcontent-%COMP%]{padding:1.5rem;display:flex;flex-direction:column;gap:1.25rem}@media(max-width:768px){.form-card-body[_ngcontent-%COMP%]{padding:1.25rem;gap:1rem}}.field-row[_ngcontent-%COMP%]{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1.25rem}@media(max-width:768px){.field-row[_ngcontent-%COMP%]{grid-template-columns:1fr}}.field-group[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.375rem}.field-label[_ngcontent-%COMP%]{font-size:.875rem;font-weight:600;color:var(--text-primary, #111827)}p-iftalabel[_ngcontent-%COMP%]{width:100%}p-iftalabel[_ngcontent-%COMP%]   input[_ngcontent-%COMP%], p-iftalabel[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]{width:100%}p-iftalabel.full-width[_ngcontent-%COMP%]{display:block}.checkbox-field[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}.checkbox-label[_ngcontent-%COMP%]{font-size:.875rem;color:var(--text-primary, #111827)}"]});let e=r;return e})();export{wt as FormsSubmissionDetailPage};
