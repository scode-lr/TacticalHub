import{a as Ve}from"./chunk-TQISBLLB.js";import"./chunk-ZAGM3QN5.js";import{a as ze}from"./chunk-3Y76LUZ2.js";import{a as Be}from"./chunk-MQKTE27O.js";import"./chunk-XVVKDVCY.js";import{e as Ne}from"./chunk-CSFFLGHJ.js";import"./chunk-I3SBQQHL.js";import"./chunk-OFECO7B5.js";import"./chunk-OKC345QC.js";import"./chunk-T3XOYAPL.js";import"./chunk-XKROLOMF.js";import"./chunk-OW5SLNL7.js";import"./chunk-BH7TBS5U.js";import{a as Ie}from"./chunk-Y55UJDCH.js";import{b as je,c as Ee,f as E}from"./chunk-C54S2Z5N.js";import"./chunk-JYMNKFIV.js";import{_ as Oe,a as Te,e as we,l as Fe,v as Pe}from"./chunk-HGNEZ5ZF.js";import"./chunk-ZA7TSTBU.js";import"./chunk-COFDKWKF.js";import"./chunk-7MAD6IOH.js";import"./chunk-OJCCOXPN.js";import"./chunk-PYW5A5UK.js";import"./chunk-KXPU4PUG.js";import"./chunk-XCYJK2YC.js";import{a as De}from"./chunk-JKLDZPQE.js";import{ja as Se,ka as H,qa as Me}from"./chunk-5C3UWAX4.js";import"./chunk-7EAS5ZLD.js";import"./chunk-TRKYTBJH.js";import"./chunk-RBGUQD7J.js";import{a as ke}from"./chunk-EBI53YWR.js";import{I as ye,K as xe,c as A,f as fe,h as ge,l as _e,o as ve,q as he,u as be}from"./chunk-3ONGYYFL.js";import{f as Ce}from"./chunk-GAOWIDLT.js";import{$a as Q,Ab as R,C as W,Ca as c,D as X,Da as l,E as Z,Ea as s,Fa as f,G as u,J as T,Ja as ie,K as w,Ka as oe,La as z,Nb as me,Oa as D,Ob as ce,Qa as F,Qb as de,Rb as pe,S as y,Sa as d,Tb as $,V as L,Va as re,Xa as I,Ya as j,Za as ae,ba as r,bb as S,cb as g,db as v,eb as q,fb as le,ia as B,ic as ue,ja as ee,lb as se,ma as te,na as ne,nb as V,oa as _,ta as x,ub as h,vb as M,wa as C,wb as G,xa as k,yb as P}from"./chunk-RLKHKPJM.js";import"./chunk-IOYOJE5H.js";import"./chunk-J2MNKKDW.js";import"./chunk-5E2TU5QO.js";import"./chunk-CJVXPTUK.js";import"./chunk-GITHW5CB.js";import"./chunk-UMTGL7G3.js";import"./chunk-YUNOCBLG.js";import"./chunk-VGMJM2GZ.js";import"./chunk-2NIBOUWM.js";import"./chunk-I547WOKC.js";import"./chunk-BJ43HUSB.js";import"./chunk-PXRN3JVL.js";import"./chunk-NMFL75IO.js";import{a as J,b as U,d as N}from"./chunk-4CLCTAJ7.js";var Re=`
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
`;var qe=["content"],Ge=["opposite"],Ke=["marker"],K=e=>({$implicit:e});function Ye(e,a){e&1&&z(0)}function Je(e,a){e&1&&z(0)}function Ue(e,a){if(e&1&&(ie(0),_(1,Je,1,0,"ng-container",3),oe()),e&2){let i=d().$implicit,t=d();r(),c("ngTemplateOutlet",t.markerTemplate||t._markerTemplate)("ngTemplateOutletContext",V(2,K,i))}}function We(e,a){if(e&1&&f(0,"div",2),e&2){let i=d(2);S(i.cx("eventMarker")),c("pBind",i.ptm("eventMarker")),x("data-p",i.dataP)}}function Xe(e,a){if(e&1&&f(0,"div",2),e&2){let i=d(2);S(i.cx("eventConnector")),c("pBind",i.ptm("eventConnector")),x("data-p",i.dataP)}}function Ze(e,a){e&1&&z(0)}function et(e,a){if(e&1&&(l(0,"div",2)(1,"div",2),_(2,Ye,1,0,"ng-container",3),s(),l(3,"div",2),_(4,Ue,2,4,"ng-container",4)(5,We,1,4,"ng-template",null,0,P)(7,Xe,1,4,"div",5),s(),l(8,"div",2),_(9,Ze,1,0,"ng-container",3),s()()),e&2){let i=a.$implicit,t=a.last,n=ae(6),o=d();S(o.cx("event")),c("pBind",o.ptm("event")),x("data-p",o.dataP),r(),S(o.cx("eventOpposite")),c("pBind",o.ptm("eventOpposite")),x("data-p",o.dataP),r(),c("ngTemplateOutlet",o.oppositeTemplate||o._oppositeTemplate)("ngTemplateOutletContext",V(23,K,i)),r(),S(o.cx("eventSeparator")),c("pBind",o.ptm("eventSeparator")),x("data-p",o.dataP),r(),c("ngIf",o.markerTemplate||o._markerTemplate)("ngIfElse",n),r(3),c("ngIf",!t),r(),S(o.cx("eventContent")),c("pBind",o.ptm("eventContent")),x("data-p",o.dataP),r(),c("ngTemplateOutlet",o.contentTemplate||o._contentTemplate)("ngTemplateOutletContext",V(25,K,i))}}var tt={root:({instance:e})=>["p-timeline p-component","p-timeline-"+e.align,"p-timeline-"+e.layout],event:"p-timeline-event",eventOpposite:"p-timeline-event-opposite",eventSeparator:"p-timeline-event-separator",eventMarker:"p-timeline-event-marker",eventConnector:"p-timeline-event-connector",eventContent:"p-timeline-event-content"},$e=(()=>{class e extends Me{name="timeline";style=Re;classes=tt;static \u0275fac=(()=>{let i;return function(n){return(i||(i=L(e)))(n||e)}})();static \u0275prov=W({token:e,factory:e.\u0275fac})}return e})();var Ae=new Z("TIMELINE_INSTANCE"),Y=(()=>{class e extends Ee{componentName="Timeline";bindDirectiveInstance=u(E,{self:!0});$pcTimeline=u(Ae,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}value;styleClass;align="left";layout="vertical";contentTemplate;oppositeTemplate;markerTemplate;templates;_contentTemplate;_oppositeTemplate;_markerTemplate;_componentStyle=u($e);getBlockableElement(){return this.el.nativeElement.children[0]}onAfterContentInit(){this.templates.forEach(i=>{switch(i.getType()){case"content":this._contentTemplate=i.template;break;case"opposite":this._oppositeTemplate=i.template;break;case"marker":this._markerTemplate=i.template;break}})}get dataP(){return this.cn({[this.layout]:this.layout,[this.align]:this.align})}static \u0275fac=(()=>{let i;return function(n){return(i||(i=L(e)))(n||e)}})();static \u0275cmp=B({type:e,selectors:[["p-timeline"]],contentQueries:function(t,n,o){if(t&1&&re(o,qe,4)(o,Ge,4)(o,Ke,4)(o,Se,4),t&2){let m;I(m=j())&&(n.contentTemplate=m.first),I(m=j())&&(n.oppositeTemplate=m.first),I(m=j())&&(n.markerTemplate=m.first),I(m=j())&&(n.templates=m)}},hostVars:3,hostBindings:function(t,n){t&2&&(x("data-p",n.dataP),S(n.cn(n.cx("root"),n.styleClass)))},inputs:{value:"value",styleClass:"styleClass",align:"align",layout:"layout"},features:[se([$e,{provide:Ae,useExisting:e},{provide:je,useExisting:e}]),te([E]),ne],decls:1,vars:1,consts:[["marker",""],[3,"pBind","class",4,"ngFor","ngForOf"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],[4,"ngIf","ngIfElse"],[3,"pBind","class",4,"ngIf"]],template:function(t,n){t&1&&_(0,et,10,27,"div",1),t&2&&c("ngForOf",n.value)},dependencies:[$,me,ce,de,H,E],encapsulation:2,changeDetection:0})}return e})(),He=(()=>{class e{static \u0275fac=function(t){return new(t||e)};static \u0275mod=ee({type:e});static \u0275inj=X({imports:[Y,H,H]})}return e})();function it(e,a){e&1&&(l(0,"div",7),f(1,"div",8)(2,"div",9)(3,"div",10)(4,"div",10),s())}function ot(e,a){if(e&1&&(l(0,"p",19),g(1),s()),e&2){let i=d();r(),v(i.description)}}function rt(e,a){e&1&&C(0,ot,2,1,"p",19),e&2&&k(a.description?0:-1)}function at(e,a){if(e&1){let i=D();l(0,"button",28),F("click",function(){T(i);let n=d(3);return w(n.showHistory.set(!0))}),f(1,"ion-icon",29),g(2),h(3,"translate"),s()}if(e&2){let i=d(3);r(2),le(" ",M(3,2,"viewer.forms.submission.viewHistory")," (",i.rejectionComments().length,") ")}}function lt(e,a){if(e&1&&(l(0,"div",11),f(1,"div",20),l(2,"div",21)(3,"div",22),f(4,"ion-icon",23),l(5,"span",24),g(6),h(7,"translate"),s(),l(8,"span",25),g(9),h(10,"date"),s()(),l(11,"p",26),g(12),s(),C(13,at,4,4,"button",27),s()()),e&2){let i=d(2);r(6),v(M(7,4,"viewer.forms.submission.rejectionFeedback")),r(3),v(G(10,6,i.latestComment().date,"mediumDate")),r(3),v(i.latestComment().text),r(),k(i.rejectionComments().length>1?13:-1)}}function st(e,a){if(e&1&&(l(0,"div",38),f(1,"ion-icon",39),s()),e&2){let i=a.$implicit,t=d(4);Q("history-marker--latest",t.isLatestComment(i))}}function mt(e,a){if(e&1&&(l(0,"span",40),g(1),h(2,"date"),s()),e&2){let i=a.$implicit;r(),v(G(2,1,i.date,"mediumDate"))}}function ct(e,a){if(e&1&&(l(0,"p",41),g(1),s()),e&2){let i=a.$implicit,t=d(4);Q("history-comment--latest",t.isLatestComment(i)),r(),v(i.text)}}function dt(e,a){if(e&1){let i=D();l(0,"div",31)(1,"div",32)(2,"h2",33),g(3),h(4,"translate"),s(),l(5,"button",34),F("click",function(){T(i);let n=d(3);return w(n.showHistory.set(!1))}),f(6,"ion-icon",35),s()(),l(7,"div",36)(8,"p-timeline",37),_(9,st,2,2,"ng-template",null,0,P)(11,mt,3,4,"ng-template",null,1,P)(13,ct,2,3,"ng-template",null,2,P),s()()()}if(e&2){let i=d(3);r(3),v(M(4,2,"viewer.forms.submission.commentHistory")),r(5),c("value",i.rejectionComments())}}function pt(e,a){if(e&1){let i=D();l(0,"ion-modal",30),F("didDismiss",function(){T(i);let n=d(2);return w(n.showHistory.set(!1))}),_(1,dt,15,4,"ng-template"),s()}if(e&2){let i=d(2);c("isOpen",i.showHistory())}}function ut(e,a){if(e&1){let i=D();C(0,rt,1,1),C(1,lt,14,9,"div",11),C(2,pt,2,1,"ion-modal",12),l(3,"div",13)(4,"form",14),F("ngSubmit",function(){T(i);let n=d();return w(n.onFormSubmit())}),f(5,"app-dynamic-form-fields",15),l(6,"div",16)(7,"button",17),F("click",function(){T(i);let n=d();return w(n.onFormCancel())}),g(8),h(9,"translate"),s(),l(10,"button",18),g(11),h(12,"translate"),s()()()()}if(e&2){let i,t=d();k((i=t.formDetail())?0:-1,i),r(),k(t.isEditing()&&t.latestComment()?1:-1),r(),k(t.rejectionComments().length>1?2:-1),r(2),c("formGroup",t.dynamicForm),r(),c("fields",t.activeFormFields())("form",t.dynamicForm)("fieldStates",t.rejectedFieldStatuses()),r(3),q(" ",M(9,10,"common.cancel")," "),r(2),c("disabled",t.isSubmitting()),r(),q(" ",M(12,12,t.isEditing()?"viewer.forms.submission.resend":"common.submit")," ")}}var Jt=(()=>{let a=class a{constructor(){this.route=u(ue),this.navigationService=u(ke),this.translationService=u(Ce),this.toastController=u(ye),this.formService=u(Be),this.formSubmissionsService=u(Ie),this.fb=u(ve),this.formId=0,this.submissionId=-1,this.formDetail=y(null),this.formFields=y([]),this.isSubmitting=y(!1),this.loading=y(!0),this.rejectedFieldStatuses=y({}),this.rejectionComments=y([]),this.isEditing=R(()=>this.submissionId>0),this.activeFormFields=R(()=>{let t=this.rejectedFieldStatuses();return Object.keys(t).length?this.formFields().map(n=>t[n.key]?U(J({},n),{status:t[n.key]}):n):this.formFields()}),this.showHistory=y(!1),this.latestComment=R(()=>{let t=this.rejectionComments();return t.length?t[t.length-1]:null}),Te({alertCircleOutline:we,timeOutline:Oe,chatbubbleOutline:Fe,closeOutline:Pe})}isLatestComment(t){let n=this.rejectionComments();return n.length>0&&t===n[n.length-1]}ngOnInit(){return N(this,null,function*(){let t=this.route.snapshot.paramMap.get("formId"),n=this.route.snapshot.paramMap.get("submissionId");this.formId=Number(t),this.submissionId=n&&n!=="-1"?Number(n):-1;let o=yield this.formService.getFormById(this.formId),m=[...o.fields??[]].sort((p,b)=>p.order-b.order);this.formDetail.set(o),this.formFields.set(m),this.buildDynamicForm(m),this.submissionId>0&&(yield this.prefillFromSubmission(this.submissionId)),this.loading.set(!1)})}prefillFromSubmission(t){return N(this,null,function*(){let n=yield this.formSubmissionsService.getSubmission(t),o={},m={};for(let p of n.values){let b=p.valueText??p.valueNumber??p.valueDate??p.valueBoolean??null;b!==null&&(o[p.fieldKey]=b),p.status&&(m[p.fieldKey]=p.status)}this.dynamicForm.patchValue(o),this.rejectedFieldStatuses.set(m),this.rejectionComments.set(Ve(n.comment))})}buildDynamicForm(t){let n={};for(let o of t){let m=[];o.isRequired&&m.push(A.required),o.maxLength&&m.push(A.maxLength(o.maxLength)),o.type==="email"&&m.push(A.email);let p=o.type==="boolean"&&!o.options?.length?!1:null;n[o.key]=this.fb.control(p,m)}this.dynamicForm=this.fb.group(n)}onFormSubmit(){return N(this,null,function*(){if(this.dynamicForm.invalid){this.dynamicForm.markAllAsTouched();return}this.isSubmitting.set(!0);try{let t=this.dynamicForm.value,n=Object.keys(t).reduce((p,b)=>{let O=t[b];return O instanceof Date?p[b]=O.toISOString():O!=null&&(p[b]=O),p},{});this.isEditing()?yield this.formSubmissionsService.resubmitForm(this.submissionId,{values:n}):yield this.formSubmissionsService.submitForm(this.formId,{values:n});let o=this.isEditing()?"viewer.action.form.success.resubmitMessage":"viewer.action.form.success.submitMessage";yield(yield this.toastController.create({message:this.translationService.instant(o),duration:3e3,position:"top",color:"success",icon:"checkmark-circle-outline"})).present(),this.goToFormDetail()}catch(t){yield(yield this.toastController.create({message:this.translationService.instant("viewer.action.form.errors.submitError"),duration:3e3,position:"top",color:"danger",icon:"alert-circle-outline"})).present()}finally{this.isSubmitting.set(!1)}})}onFormCancel(){this.goToFormDetail()}pageTitle(){return this.formDetail()?.name??""}backRoute(){let{roleType:t,roleId:n}=this.navigationService.extractRoleDetails();return`/app/${t}/${n}/forms/${this.formId}`}goToFormDetail(){let{roleType:t,roleId:n}=this.navigationService.extractRoleDetails();this.navigationService.navigateTo([`/app/${t}/${n}/forms/${this.formId}`])}};a.\u0275fac=function(n){return new(n||a)},a.\u0275cmp=B({type:a,selectors:[["app-form-detail-submission"]],decls:8,vars:6,consts:[["marker",""],["opposite",""],["content",""],[1,"page-container"],[1,"section-header-with-back-button"],[3,"route"],[1,"section-title"],[1,"form-skeleton"],[1,"skeleton-title"],[1,"skeleton-description"],[1,"skeleton-field"],[1,"rejection-banner"],[1,"comments-history-modal",3,"isOpen"],[1,"form-wrapper"],["novalidate","",1,"dynamic-form",3,"ngSubmit","formGroup"],[3,"fields","form","fieldStates"],[1,"form-actions"],["type","button",1,"btn-secondary",3,"click"],["type","submit",1,"btn-primary",3,"disabled"],[1,"form-description"],[1,"rejection-banner__stripe"],[1,"rejection-banner__body"],[1,"rejection-banner__header"],["name","alert-circle-outline",1,"rejection-banner__icon"],[1,"rejection-banner__label"],[1,"rejection-banner__date"],[1,"rejection-banner__text"],["type","button",1,"rejection-banner__history-btn"],["type","button",1,"rejection-banner__history-btn",3,"click"],["name","time-outline"],[1,"comments-history-modal",3,"didDismiss","isOpen"],[1,"history-modal"],[1,"history-modal__header"],[1,"history-modal__title"],[1,"history-modal__close",3,"click"],["name","close-outline"],[1,"history-modal__content"],["align","left",3,"value"],[1,"history-marker"],["name","chatbubble-outline"],[1,"history-date"],[1,"history-comment"]],template:function(n,o){n&1&&(l(0,"div",3)(1,"div",4),f(2,"app-back-button",5),l(3,"h1",6),g(4),h(5,"translate"),s()(),C(6,it,5,0,"div",7),C(7,ut,13,14),s()),n&2&&(r(2),c("route",o.backRoute()),r(2),v(M(5,4,o.pageTitle())),r(2),k(o.loading()?6:-1),r(),k(o.loading()?-1:7))},dependencies:[$,he,ge,fe,_e,xe,be,He,Y,ze,Ne,pe,De],styles:[".form-description[_ngcontent-%COMP%]{margin:0 0 1.5rem;font-size:.9375rem;color:var(--text-secondary, #6b7280);line-height:1.5}.rejection-banner[_ngcontent-%COMP%]{display:flex;gap:0;border-radius:12px;background:#fef2f2;border:1px solid rgba(220,38,38,.2);overflow:hidden;margin-bottom:1.5rem;animation:_ngcontent-%COMP%_fadeIn .35s ease}.rejection-banner__stripe[_ngcontent-%COMP%]{width:4px;flex-shrink:0;background:linear-gradient(180deg,#ef4444,#dc2626);border-radius:12px 0 0 12px}.rejection-banner__body[_ngcontent-%COMP%]{flex:1;padding:1rem 1rem .875rem;display:flex;flex-direction:column;gap:.5rem}.rejection-banner__header[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem}.rejection-banner__icon[_ngcontent-%COMP%]{font-size:1rem;color:#dc2626;flex-shrink:0}.rejection-banner__label[_ngcontent-%COMP%]{font-size:.75rem;font-weight:600;text-transform:uppercase;letter-spacing:.06em;color:#b91c1c;flex:1}.rejection-banner__date[_ngcontent-%COMP%]{font-size:.72rem;color:var(--text-secondary, #9ca3af);white-space:nowrap}.rejection-banner__text[_ngcontent-%COMP%]{margin:0;font-size:.9rem;line-height:1.55;color:var(--text-primary, #111827)}.rejection-banner__history-btn[_ngcontent-%COMP%]{display:inline-flex;align-items:center;gap:.35rem;margin-top:.25rem;padding:0;background:none;border:none;font-size:.8rem;font-weight:500;color:#dc2626;cursor:pointer;transition:opacity .15s}.rejection-banner__history-btn[_ngcontent-%COMP%]   ion-icon[_ngcontent-%COMP%]{font-size:.9rem}.rejection-banner__history-btn[_ngcontent-%COMP%]:active{opacity:.6}.comments-history-modal[_ngcontent-%COMP%]{--height: auto;--max-height: 70vh;--border-radius: 20px 20px 0 0;align-items:flex-end}.history-modal[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%}.history-modal__header[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.25rem .75rem;border-bottom:1px solid var(--border-light, #e5e7eb)}.history-modal__title[_ngcontent-%COMP%]{font-size:1rem;font-weight:600;color:var(--text-primary, #111827);margin:0}.history-modal__close[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:50%;background:var(--background-tertiary, #f3f4f6);border:none;color:var(--text-secondary, #6b7280);font-size:1.1rem;cursor:pointer}.history-modal__content[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:1.25rem 1rem 2rem}.history-marker[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;width:2rem;height:2rem;border-radius:50%;background:var(--background-tertiary, #f3f4f6);border:2px solid var(--border-light, #e5e7eb);color:var(--text-secondary, #9ca3af);font-size:.85rem}.history-marker--latest[_ngcontent-%COMP%]{background:#fee2e2;border-color:#dc2626;color:#dc2626}.history-date[_ngcontent-%COMP%]{font-size:.75rem;color:var(--text-secondary, #9ca3af);white-space:nowrap}.history-comment[_ngcontent-%COMP%]{margin:0;font-size:.875rem;line-height:1.5;color:var(--text-secondary, #6b7280)}.history-comment--latest[_ngcontent-%COMP%]{color:var(--text-primary, #111827);font-weight:500}.form-wrapper[_ngcontent-%COMP%]{margin:0 auto;animation:_ngcontent-%COMP%_fadeIn .3s ease}.dynamic-form[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:1.25rem}.form-actions[_ngcontent-%COMP%]{display:flex;justify-content:flex-end;gap:.75rem;margin-top:.75rem;padding-top:1.5rem;border-top:1px solid var(--border-light, #e5e7eb)}.form-skeleton[_ngcontent-%COMP%]{max-width:640px;margin:0 auto;display:flex;flex-direction:column;gap:1.25rem}.skeleton-title[_ngcontent-%COMP%]{height:2rem;width:60%;border-radius:8px;background:var(--background-tertiary, #e9ecef);animation:_ngcontent-%COMP%_shimmer 1.5s infinite}.skeleton-description[_ngcontent-%COMP%]{height:1rem;width:90%;border-radius:8px;background:var(--background-tertiary, #e9ecef);animation:_ngcontent-%COMP%_shimmer 1.5s infinite .1s;margin-bottom:.75rem}.skeleton-field[_ngcontent-%COMP%]{height:3.5rem;border-radius:10px;background:var(--background-tertiary, #e9ecef);animation:_ngcontent-%COMP%_shimmer 1.5s infinite}.skeleton-field[_ngcontent-%COMP%]:nth-child(3){animation-delay:.1s}.skeleton-field[_ngcontent-%COMP%]:nth-child(4){animation-delay:.2s}.skeleton-field[_ngcontent-%COMP%]:nth-child(5){animation-delay:.3s}@keyframes _ngcontent-%COMP%_shimmer{0%,to{opacity:1}50%{opacity:.5}}@keyframes _ngcontent-%COMP%_fadeIn{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@media(max-width:768px){.form-actions[_ngcontent-%COMP%]{flex-direction:column-reverse}.form-actions[_ngcontent-%COMP%]   .btn-primary[_ngcontent-%COMP%], .form-actions[_ngcontent-%COMP%]   .btn-secondary[_ngcontent-%COMP%]{width:100%;justify-content:center}}"]});let e=a;return e})();export{Jt as FormDetailSubmissionPage};
