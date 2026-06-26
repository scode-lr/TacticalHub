import{a as He}from"./chunk-T72DUAOX.js";import"./chunk-YDINKQ2D.js";import"./chunk-3LWYPVLT.js";import"./chunk-XZ7MSNM7.js";import"./chunk-NF4URMQI.js";import"./chunk-WLGJ44GM.js";import"./chunk-KPAIC6N5.js";import{e as $e}from"./chunk-QIGTVMOZ.js";import"./chunk-DNT2YPIJ.js";import"./chunk-73B4Z4WP.js";import{a as Ae}from"./chunk-QUW2HBEX.js";import"./chunk-2OR3SPWP.js";import"./chunk-IKFQJXGQ.js";import"./chunk-H2IHI6CH.js";import"./chunk-2R3XOPA4.js";import"./chunk-H5QVNRSX.js";import{a as ze,b as Ve}from"./chunk-74N3KCPD.js";import"./chunk-MNI6LWS6.js";import{a as Ee}from"./chunk-53VRELAY.js";import{b as Be,c as Ne,f as B}from"./chunk-I6S6MIYT.js";import"./chunk-J6SIU543.js";import{a as Re}from"./chunk-USGRU7QK.js";import{a as Pe,e as we,m as Oe,na as De,x as Ie}from"./chunk-BSIP4GSJ.js";import"./chunk-PDHTT5OH.js";import"./chunk-A4WV7WR7.js";import{a as Q}from"./chunk-AGHBX7QW.js";import"./chunk-OJCCOXPN.js";import"./chunk-PYW5A5UK.js";import"./chunk-XWCHLSBL.js";import"./chunk-WLX6JILZ.js";import"./chunk-QZX5IDUI.js";import{a as je}from"./chunk-KY566336.js";import{ja as Te,ka as L,qa as Fe}from"./chunk-R6LRXJKK.js";import"./chunk-QUINHWZM.js";import"./chunk-JLBT5YB4.js";import"./chunk-7PK2PHDT.js";import{a as Me}from"./chunk-QWQQFDBG.js";import{A as xe,O as Ce,P as ke,d as H,g as _e,j as ve,n as he,u as be,w as ye}from"./chunk-7RM65OIE.js";import{f as Se}from"./chunk-JYIS4P3W.js";import{$a as G,Bb as $,C as Z,Ca as c,D as ee,Da as l,E as te,Ea as s,Fa as g,G as f,J as P,Ja as re,K as w,Ka as ae,La as V,Oa as D,Ob as de,Pb as pe,Qa as O,Rb as ue,S as x,Sa as d,Sb as fe,Ub as A,V as q,Va as le,Xa as j,Ya as E,Za as se,ba as r,bb as M,cb as _,db as h,eb as K,fb as me,ia as z,ja as ne,kc as ge,ma as ie,mb as ce,na as oe,oa as v,ob as R,ta as C,vb as b,wa as k,wb as F,xa as S,xb as Y,zb as I}from"./chunk-ZME6Q24X.js";import"./chunk-IOYOJE5H.js";import"./chunk-J2MNKKDW.js";import"./chunk-5E2TU5QO.js";import"./chunk-CJVXPTUK.js";import"./chunk-GITHW5CB.js";import"./chunk-UMTGL7G3.js";import"./chunk-YUNOCBLG.js";import"./chunk-VGMJM2GZ.js";import"./chunk-2NIBOUWM.js";import"./chunk-I547WOKC.js";import"./chunk-BJ43HUSB.js";import"./chunk-PXRN3JVL.js";import"./chunk-NMFL75IO.js";import{a as W,b as X,d as N}from"./chunk-4CLCTAJ7.js";var Le=`
    .p-timeline {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        direction: ltr;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .p-timeline-left .p-timeline-event-opposite {
        text-align: right;
    }

    .p-timeline-left .p-timeline-event-content {
        text-align: left;
    }

    .p-timeline-right .p-timeline-event {
        flex-direction: row-reverse;
    }

    .p-timeline-right .p-timeline-event-opposite {
        text-align: left;
    }

    .p-timeline-right .p-timeline-event-content {
        text-align: right;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) {
        flex-direction: row-reverse;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-opposite {
        text-align: right;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(odd) .p-timeline-event-content {
        text-align: left;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-opposite {
        text-align: left;
    }

    .p-timeline-vertical.p-timeline-alternate .p-timeline-event:nth-child(even) .p-timeline-event-content {
        text-align: right;
    }

    .p-timeline-vertical .p-timeline-event-opposite,
    .p-timeline-vertical .p-timeline-event-content {
        padding: dt('timeline.vertical.event.content.padding');
    }

    .p-timeline-vertical .p-timeline-event-connector {
        width: dt('timeline.event.connector.size');
    }

    .p-timeline-event {
        display: flex;
        position: relative;
        min-height: dt('timeline.event.min.height');
    }

    .p-timeline-event:last-child {
        min-height: 0;
    }

    .p-timeline-event-opposite {
        flex: 1;
    }

    .p-timeline-event-content {
        flex: 1;
    }

    .p-timeline-event-separator {
        flex: 0;
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    .p-timeline-event-marker {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        align-self: baseline;
        border-width: dt('timeline.event.marker.border.width');
        border-style: solid;
        border-color: dt('timeline.event.marker.border.color');
        border-radius: dt('timeline.event.marker.border.radius');
        width: dt('timeline.event.marker.size');
        height: dt('timeline.event.marker.size');
        background: dt('timeline.event.marker.background');
    }

    .p-timeline-event-marker::before {
        content: ' ';
        border-radius: dt('timeline.event.marker.content.border.radius');
        width: dt('timeline.event.marker.content.size');
        height: dt('timeline.event.marker.content.size');
        background: dt('timeline.event.marker.content.background');
    }

    .p-timeline-event-marker::after {
        content: ' ';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: dt('timeline.event.marker.border.radius');
        box-shadow: dt('timeline.event.marker.content.inset.shadow');
    }

    .p-timeline-event-connector {
        flex-grow: 1;
        background: dt('timeline.event.connector.color');
    }

    .p-timeline-horizontal {
        flex-direction: row;
    }

    .p-timeline-horizontal .p-timeline-event {
        flex-direction: column;
        flex: 1;
    }

    .p-timeline-horizontal .p-timeline-event:last-child {
        flex: 0;
    }

    .p-timeline-horizontal .p-timeline-event-separator {
        flex-direction: row;
    }

    .p-timeline-horizontal .p-timeline-event-connector {
        width: 100%;
        height: dt('timeline.event.connector.size');
    }

    .p-timeline-horizontal .p-timeline-event-opposite,
    .p-timeline-horizontal .p-timeline-event-content {
        padding: dt('timeline.horizontal.event.content.padding');
    }

    .p-timeline-horizontal.p-timeline-alternate .p-timeline-event:nth-child(even) {
        flex-direction: column-reverse;
    }

    .p-timeline-bottom .p-timeline-event {
        flex-direction: column-reverse;
    }
`;var Je=["content"],Ue=["opposite"],We=["marker"],J=e=>({$implicit:e});function Xe(e,a){e&1&&V(0)}function Ze(e,a){e&1&&V(0)}function et(e,a){if(e&1&&(re(0),v(1,Ze,1,0,"ng-container",3),ae()),e&2){let i=d().$implicit,t=d();r(),c("ngTemplateOutlet",t.markerTemplate||t._markerTemplate)("ngTemplateOutletContext",R(2,J,i))}}function tt(e,a){if(e&1&&g(0,"div",2),e&2){let i=d(2);M(i.cx("eventMarker")),c("pBind",i.ptm("eventMarker")),C("data-p",i.dataP)}}function nt(e,a){if(e&1&&g(0,"div",2),e&2){let i=d(2);M(i.cx("eventConnector")),c("pBind",i.ptm("eventConnector")),C("data-p",i.dataP)}}function it(e,a){e&1&&V(0)}function ot(e,a){if(e&1&&(l(0,"div",2)(1,"div",2),v(2,Xe,1,0,"ng-container",3),s(),l(3,"div",2),v(4,et,2,4,"ng-container",4)(5,tt,1,4,"ng-template",null,0,I)(7,nt,1,4,"div",5),s(),l(8,"div",2),v(9,it,1,0,"ng-container",3),s()()),e&2){let i=a.$implicit,t=a.last,n=se(6),o=d();M(o.cx("event")),c("pBind",o.ptm("event")),C("data-p",o.dataP),r(),M(o.cx("eventOpposite")),c("pBind",o.ptm("eventOpposite")),C("data-p",o.dataP),r(),c("ngTemplateOutlet",o.oppositeTemplate||o._oppositeTemplate)("ngTemplateOutletContext",R(23,J,i)),r(),M(o.cx("eventSeparator")),c("pBind",o.ptm("eventSeparator")),C("data-p",o.dataP),r(),c("ngIf",o.markerTemplate||o._markerTemplate)("ngIfElse",n),r(3),c("ngIf",!t),r(),M(o.cx("eventContent")),c("pBind",o.ptm("eventContent")),C("data-p",o.dataP),r(),c("ngTemplateOutlet",o.contentTemplate||o._contentTemplate)("ngTemplateOutletContext",R(25,J,i))}}var rt={root:({instance:e})=>["p-timeline p-component","p-timeline-"+e.align,"p-timeline-"+e.layout],event:"p-timeline-event",eventOpposite:"p-timeline-event-opposite",eventSeparator:"p-timeline-event-separator",eventMarker:"p-timeline-event-marker",eventConnector:"p-timeline-event-connector",eventContent:"p-timeline-event-content"},Qe=(()=>{class e extends Fe{name="timeline";style=Le;classes=rt;static \u0275fac=(()=>{let i;return function(n){return(i||(i=q(e)))(n||e)}})();static \u0275prov=Z({token:e,factory:e.\u0275fac})}return e})();var qe=new te("TIMELINE_INSTANCE"),U=(()=>{class e extends Ne{componentName="Timeline";bindDirectiveInstance=f(B,{self:!0});$pcTimeline=f(qe,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value;styleClass;align="left";layout="vertical";contentTemplate;oppositeTemplate;markerTemplate;templates;_contentTemplate;_oppositeTemplate;_markerTemplate;_componentStyle=f(Qe);getBlockableElement(){return this.el.nativeElement.children[0]}onAfterContentInit(){this.templates.forEach(i=>{switch(i.getType()){case"content":this._contentTemplate=i.template;break;case"opposite":this._oppositeTemplate=i.template;break;case"marker":this._markerTemplate=i.template;break}})}get dataP(){return this.cn({[this.layout]:this.layout,[this.align]:this.align})}static \u0275fac=(()=>{let i;return function(n){return(i||(i=q(e)))(n||e)}})();static \u0275cmp=z({type:e,selectors:[["p-timeline"]],contentQueries:function(t,n,o){if(t&1&&le(o,Je,4)(o,Ue,4)(o,We,4)(o,Te,4),t&2){let m;j(m=E())&&(n.contentTemplate=m.first),j(m=E())&&(n.oppositeTemplate=m.first),j(m=E())&&(n.markerTemplate=m.first),j(m=E())&&(n.templates=m)}},hostVars:3,hostBindings:function(t,n){t&2&&(C("data-p",n.dataP),M(n.cn(n.cx("root"),n.styleClass)))},inputs:{value:"value",styleClass:"styleClass",align:"align",layout:"layout"},features:[ce([Qe,{provide:qe,useExisting:e},{provide:Be,useExisting:e}]),ie([B]),oe],decls:1,vars:1,consts:[["marker",""],[3,"pBind","class",4,"ngFor","ngForOf"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"]],template:function(t,n){t&1&&v(0,ot,10,27,"div",1),t&2&&c("ngForOf",n.value)},dependencies:[A,de,pe,ue,L,B],encapsulation:2,changeDetection:0})}return e})(),Ge=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=ne({type:e});static \u0275inj=ee({imports:[U,L,L]})}return e})();function lt(e,a){e&1&&(l(0,"div",7),g(1,"div",8)(2,"div",9)(3,"div",10)(4,"div",10),s())}function st(e,a){if(e&1&&(l(0,"p",19),_(1),s()),e&2){let i=d();r(),h(i.description)}}function mt(e,a){e&1&&k(0,st,2,1,"p",19),e&2&&S(a.description?0:-1)}function ct(e,a){if(e&1){let i=D();l(0,"button",28),O("click",function(){P(i);let n=d(3);return w(n.showHistory.set(!0))}),g(1,"ion-icon",29),_(2),b(3,"translate"),s()}if(e&2){let i=d(3);r(2),me(" ",F(3,2,"user.forms.submission.viewHistory")," (",i.rejectionComments().length,") ")}}function dt(e,a){if(e&1&&(l(0,"div",11),g(1,"div",20),l(2,"div",21)(3,"div",22),g(4,"ion-icon",23),l(5,"span",24),_(6),b(7,"translate"),s(),l(8,"span",25),_(9),b(10,"date"),s()(),l(11,"p",26),_(12),s(),k(13,ct,4,4,"button",27),s()()),e&2){let i=d(2);r(6),h(F(7,4,"user.forms.submission.rejectionFeedback")),r(3),h(Y(10,6,i.latestComment().date,"mediumDate")),r(3),h(i.latestComment().text),r(),S(i.rejectionComments().length>1?13:-1)}}function pt(e,a){if(e&1&&(l(0,"div",38),g(1,"ion-icon",39),s()),e&2){let i=a.$implicit,t=d(4);G("history-marker--latest",t.isLatestComment(i))}}function ut(e,a){if(e&1&&(l(0,"span",40),_(1),b(2,"date"),s()),e&2){let i=a.$implicit;r(),h(Y(2,1,i.date,"mediumDate"))}}function ft(e,a){if(e&1&&(l(0,"p",41),_(1),s()),e&2){let i=a.$implicit,t=d(4);G("history-comment--latest",t.isLatestComment(i)),r(),h(i.text)}}function gt(e,a){if(e&1){let i=D();l(0,"div",31)(1,"div",32)(2,"h2",33),_(3),b(4,"translate"),s(),l(5,"button",34),O("click",function(){P(i);let n=d(3);return w(n.showHistory.set(!1))}),g(6,"ion-icon",35),s()(),l(7,"div",36)(8,"p-timeline",37),v(9,pt,2,2,"ng-template",null,0,I)(11,ut,3,4,"ng-template",null,1,I)(13,ft,2,3,"ng-template",null,2,I),s()()()}if(e&2){let i=d(3);r(3),h(F(4,2,"user.forms.submission.commentHistory")),r(5),c("value",i.rejectionComments())}}function _t(e,a){if(e&1){let i=D();l(0,"ion-modal",30),O("didDismiss",function(){P(i);let n=d(2);return w(n.showHistory.set(!1))}),v(1,gt,15,4,"ng-template"),s()}if(e&2){let i=d(2);c("isOpen",i.showHistory())}}function vt(e,a){if(e&1){let i=D();k(0,mt,1,1),k(1,dt,14,9,"div",11),k(2,_t,2,1,"ion-modal",12),l(3,"div",13)(4,"form",14),O("ngSubmit",function(){P(i);let n=d();return w(n.onFormSubmit())}),g(5,"app-dynamic-form-fields",15),l(6,"div",16)(7,"button",17),O("click",function(){P(i);let n=d();return w(n.cancelSubmission())}),_(8),b(9,"translate"),s(),l(10,"button",18),_(11),b(12,"translate"),s()()()()}if(e&2){let i,t=d();S((i=t.formDetail())?0:-1,i),r(),S(t.isEditing()&&t.latestComment()?1:-1),r(),S(t.rejectionComments().length>1?2:-1),r(2),c("formGroup",t.dynamicForm),r(),c("fields",t.activeFormFields())("form",t.dynamicForm)("fieldStates",t.rejectedFieldStatuses()),r(3),K(" ",F(9,10,"common.cancel")," "),r(2),c("disabled",t.isSubmitting()),r(),K(" ",F(12,12,t.isEditing()?"user.forms.submission.resend":"common.submit")," ")}}var tn=(()=>{let a=class a{constructor(){this.route=f(ge),this.navigationService=f(Me),this.translationService=f(Se),this.toastController=f(Ce),this.formService=f(Re),this.formSubmissionsService=f(Ee),this.fb=f(be),this.formId=0,this.submissionId=-1,this.formDetail=x(null),this.formFields=x([]),this.isSubmitting=x(!1),this.loading=x(!0),this.rejectedFieldStatuses=x({}),this.rejectionComments=x([]),this.isEditing=$(()=>this.submissionId>0),this.activeFormFields=$(()=>{let t=this.rejectedFieldStatuses();return Object.keys(t).length?this.formFields().map(n=>t[n.key]?X(W({},n),{status:t[n.key]}):n):this.formFields()}),this.showHistory=x(!1),this.latestComment=$(()=>{let t=this.rejectionComments();return t.length?t[t.length-1]:null}),Pe({alertCircleOutline:we,timeOutline:De,chatbubbleOutline:Oe,closeOutline:Ie})}isLatestComment(t){let n=this.rejectionComments();return n.length>0&&t===n[n.length-1]}ngOnInit(){return N(this,null,function*(){let t=this.route.snapshot.paramMap.get("formId"),n=this.route.snapshot.paramMap.get("submissionId");this.formId=Number(t),this.submissionId=n&&n!=="-1"?Number(n):-1;let o=yield this.formService.getFormById(this.formId),m=[...o.fields??[]].sort((u,p)=>u.order-p.order);this.formDetail.set(o),this.formFields.set(m),this.buildDynamicForm(m),this.submissionId>0&&(yield this.prefillFromSubmission(this.submissionId)),this.loading.set(!1)})}prefillFromSubmission(t){return N(this,null,function*(){let n=yield this.formSubmissionsService.getSubmission(t),o={},m={};for(let u of n.values){let p=u.valueText??u.valueNumber??u.valueDate??u.valueBoolean??null;p!==null&&(o[u.fieldKey]=p),u.status&&(m[u.fieldKey]=u.status)}this.dynamicForm.patchValue(o),this.rejectedFieldStatuses.set(m),this.rejectionComments.set(He(n.comment))})}buildDynamicForm(t){let n={};for(let o of t){let m=[];o.isRequired&&m.push(H.required),o.maxLength&&o.maxLength>0&&m.push(H.maxLength(o.maxLength)),o.type===Q.Email&&m.push(H.email),o.type===Q.Iban&&m.push(p=>{let y=p.value;return!y||Ve(y)?null:{iban:!0}});let u=o.options?.length?null:!1;n[o.key]=this.fb.control(u,m)}this.dynamicForm=this.fb.group(n)}onFormSubmit(){return N(this,null,function*(){if(this.dynamicForm.invalid){this.dynamicForm.markAllAsTouched();return}this.isSubmitting.set(!0);try{let t=this.dynamicForm.value,n=new Map(this.formFields().map(p=>[p.key,p])),o=Object.keys(t).reduce((p,y)=>{let T=t[y];return T instanceof Date?p[y]=T.toISOString():n.get(y)?.type===Q.Iban&&typeof T=="string"?p[y]=ze(T):T!=null&&(p[y]=T),p},{});this.isEditing()?yield this.formSubmissionsService.resubmitForm(this.submissionId,{values:o}):yield this.formSubmissionsService.submitForm(this.formId,{values:o});let m=this.isEditing()?"user.action.form.success.resubmitMessage":"user.action.form.success.submitMessage";yield(yield this.toastController.create({message:this.translationService.instant(m),duration:3e3,position:"top",color:"success",icon:"checkmark-circle-outline"})).present(),this.goToFormDetail()}catch(t){yield(yield this.toastController.create({message:this.translationService.instant("user.action.form.errors.submitError"),duration:3e3,position:"top",color:"danger",icon:"alert-circle-outline"})).present()}finally{this.isSubmitting.set(!1)}})}pageTitle(){return this.formDetail()?.name??""}backRoute(){let{roleType:t,roleId:n}=this.navigationService.extractRoleDetails();return(this.formDetail()?.submissionsCount??0)>0?`/app/${t}/${n}/forms/${this.formId}`:`/app/${t}/${n}/forms`}cancelSubmission(){this.navigationService.navigateTo([this.backRoute()])}goToFormDetail(){let{roleType:t,roleId:n}=this.navigationService.extractRoleDetails();this.navigationService.navigateTo([`/app/${t}/${n}/forms/${this.formId}`])}};a.\u0275fac=function(n){return new(n||a)},a.\u0275cmp=z({type:a,selectors:[["app-form-detail-submission"]],decls:8,vars:6,consts:[["marker",""],["opposite",""],["content",""],[1,"page-container"],[1,"section-header-with-back-button"],[3,"route"],[1,"section-title"],[1,"form-skeleton"],[1,"skeleton-title"],[1,"skeleton-description"],[1,"skeleton-field"],[1,"rejection-banner"],[1,"comments-history-modal",3,"isOpen"],[1,"form-wrapper"],["novalidate","",1,"dynamic-form",3,"ngSubmit","formGroup"],[3,"fields","form","fieldStates"],[1,"form-actions"],["type","button",1,"btn-secondary",3,"click"],["type","submit",1,"btn-primary",3,"disabled"],[1,"form-description"],[1,"rejection-banner__stripe"],[1,"rejection-banner__body"],[1,"rejection-banner__header"],["name","alert-circle-outline",1,"rejection-banner__icon"],[1,"rejection-banner__label"],[1,"rejection-banner__date"],[1,"rejection-banner__text"],["type","button",1,"rejection-banner__history-btn"],["type","button",1,"rejection-banner__history-btn",3,"click"],["name","time-outline"],[1,"comments-history-modal",3,"didDismiss","isOpen"],[1,"history-modal"],[1,"history-modal__header"],[1,"history-modal__title"],[1,"history-modal__close",3,"click"],["name","close-outline"],[1,"history-modal__content"],["align","left",3,"value"],[1,"history-marker"],["name","chatbubble-outline"],[1,"history-date"],[1,"history-comment"]],template:function(n,o){n&1&&(l(0,"div",3)(1,"div",4),g(2,"app-back-button",5),l(3,"h1",6),_(4),b(5,"translate"),s()(),k(6,lt,5,0,"div",7),k(7,vt,13,14),s()),n&2&&(r(2),c("route",o.backRoute()),r(2),h(F(5,4,o.pageTitle())),r(2),S(o.loading()?6:-1),r(),S(o.loading()?-1:7))},dependencies:[A,ye,ve,_e,he,ke,xe,Ge,U,Ae,$e,fe,je],styles:[".form-description[_ngcontent-%COMP%]{margin:0 0 1.5rem;font-size:.9375rem;color:var(--text-secondary, #6b7280);line-height:1.5}.rejection-banner[_ngcontent-%COMP%]{display:flex;gap:0;border-radius:12px;background:#fef2f2;border:1px solid rgba(220,38,38,.2);overflow:hidden;margin-bottom:1.5rem;animation:_ngcontent-%COMP%_fadeIn .35s ease}.rejection-banner__stripe[_ngcontent-%COMP%]{width:4px;flex-shrink:0;background:linear-gradient(180deg,#ef4444,#dc2626);border-radius:12px 0 0 12px}.rejection-banner__body[_ngcontent-%COMP%]{flex:1;padding:1rem 1rem .875rem;display:flex;flex-direction:column;gap:.5rem}.rejection-banner__header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}.rejection-banner__icon[_ngcontent-%COMP%]{font-size:1rem;color:#dc2626;flex-shrink:0}.rejection-banner__label[_ngcontent-%COMP%]{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#b91c1c;flex:1}.rejection-banner__date[_ngcontent-%COMP%]{font-size:.72rem;color:var(--text-secondary, #9ca3af);white-space:nowrap}.rejection-banner__text[_ngcontent-%COMP%]{margin:0;font-size:.9rem;line-height:1.55;color:var(--text-primary, #111827)}.rejection-banner__history-btn[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:.35rem;margin-top:.25rem;padding:0;background:none;border:none;font-size:.8rem;font-weight:500;color:#dc2626;cursor:pointer;transition:opacity .15s}.rejection-banner__history-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:.9rem}.rejection-banner__history-btn[_ngcontent-%COMP%]:active{opacity:.6}.comments-history-modal[_ngcontent-%COMP%]{--height: auto;--max-height: 70vh;--border-radius: 20px 20px 0 0;align-items:flex-end}.history-modal[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%}.history-modal__header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.25rem .75rem;border-bottom:1px solid var(--border-light, #e5e7eb)}.history-modal__title[_ngcontent-%COMP%]{font-size:1rem;font-weight:600;color:var(--text-primary, #111827);margin:0}.history-modal__close[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:50%;background:var(--background-tertiary, #f3f4f6);border:none;color:var(--text-secondary, #6b7280);font-size:1.1rem;cursor:pointer}.history-modal__content[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:1.25rem 1rem 2rem}.history-marker[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:50%;background:var(--background-tertiary, #f3f4f6);border:2px solid var(--border-light, #e5e7eb);color:var(--text-secondary, #9ca3af);font-size:.85rem}.history-marker--latest[_ngcontent-%COMP%]{background:#fee2e2;border-color:#dc2626;color:#dc2626}.history-date[_ngcontent-%COMP%]{font-size:.75rem;color:var(--text-secondary, #9ca3af);white-space:nowrap}.history-comment[_ngcontent-%COMP%]{margin:0;font-size:.875rem;line-height:1.5;color:var(--text-secondary, #6b7280)}.history-comment--latest[_ngcontent-%COMP%]{color:var(--text-primary, #111827);font-weight:500}.form-wrapper[_ngcontent-%COMP%]{margin:0 auto;animation:_ngcontent-%COMP%_fadeIn .3s ease}.dynamic-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.25rem}.form-actions[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:.75rem;margin-top:.75rem;padding-top:1.5rem;border-top:1px solid var(--border-light, #e5e7eb)}.form-skeleton[_ngcontent-%COMP%]{max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem}.skeleton-title[_ngcontent-%COMP%]{height:2rem;width:60%;border-radius:8px;background:var(--background-tertiary, #e9ecef);animation:_ngcontent-%COMP%_shimmer 1.5s infinite}.skeleton-description[_ngcontent-%COMP%]{height:1rem;width:90%;border-radius:8px;background:var(--background-tertiary, #e9ecef);animation:_ngcontent-%COMP%_shimmer 1.5s infinite .1s;margin-bottom:.75rem}.skeleton-field[_ngcontent-%COMP%]{height:3.5rem;border-radius:10px;background:var(--background-tertiary, #e9ecef);animation:_ngcontent-%COMP%_shimmer 1.5s infinite}.skeleton-field[_ngcontent-%COMP%]:nth-child(3){animation-delay:.1s}.skeleton-field[_ngcontent-%COMP%]:nth-child(4){animation-delay:.2s}.skeleton-field[_ngcontent-%COMP%]:nth-child(5){animation-delay:.3s}@keyframes _ngcontent-%COMP%_shimmer{0%,to{opacity:1}50%{opacity:.5}}@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@media(max-width:768px){.form-actions[_ngcontent-%COMP%]{flex-direction:column-reverse}.form-actions[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%], .form-actions[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]{width:100%;justify-content:center}}"]});let e=a;return e})();export{tn as FormDetailSubmissionPage};
