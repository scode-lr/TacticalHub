import{C as Ge,f as Oe,g as je,n as ze,q as $e,x as Ue}from"./chunk-ISJ3SLLW.js";import{b as pe,c as ce,f as M,g as Ae,h as R}from"./chunk-6A62W3RV.js";import{D as Re,ja as K,ka as F,qa as se}from"./chunk-SS4MGYQA.js";import{a as Me,e as Ee,f as Ve,h as Ne,t as Fe}from"./chunk-C5JRHPJ2.js";import{Ab as ke,B as he,C as J,Ca as o,Cb as Se,D as Z,Da as b,E as W,Ea as x,Fa as S,Fb as v,G as V,Gb as Q,Ia as N,J as f,Ja as A,K as _,Ka as O,L as y,La as H,Mb as ue,N as be,Nb as De,Oa as E,Ob as ae,Pb as Le,Q as G,Qa as B,Qb as re,Sa as p,Ta as ye,Tb as oe,Ua as Ie,V as C,Va as ee,Wa as Ce,Xa as D,Ya as L,_a as we,ba as u,bb as g,cb as te,db as le,eb as Te,ga as xe,gb as ve,hb as Pe,ia as w,ib as Be,ja as X,lb as ne,ma as Y,na as T,nb as ie,oa as c,ta as P}from"./chunk-347HTX4S.js";import{a as fe,b as _e}from"./chunk-4CLCTAJ7.js";var Qe=`
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`;var lt=["icon"],ut=["*"];function ct(t,s){if(t&1&&S(0,"span",4),t&2){let e=p(2);g(e.cx("icon")),o("ngClass",e.icon)("pBind",e.ptm("icon"))}}function dt(t,s){if(t&1&&(A(0),c(1,ct,1,4,"span",3),O()),t&2){let e=p();u(),o("ngIf",e.icon)}}function mt(t,s){}function gt(t,s){t&1&&c(0,mt,0,0,"ng-template")}function ft(t,s){if(t&1&&(b(0,"span",2),c(1,gt,1,0,null,5),x()),t&2){let e=p();g(e.cx("icon")),o("pBind",e.ptm("icon")),u(),o("ngTemplateOutlet",e.iconTemplate||e._iconTemplate)}}var _t={root:({instance:t})=>["p-tag p-component",{"p-tag-info":t.severity==="info","p-tag-success":t.severity==="success","p-tag-warn":t.severity==="warn","p-tag-danger":t.severity==="danger","p-tag-secondary":t.severity==="secondary","p-tag-contrast":t.severity==="contrast","p-tag-rounded":t.rounded}],icon:"p-tag-icon",label:"p-tag-label"},Ke=(()=>{class t extends se{name="tag";style=Qe;classes=_t;static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275prov=J({token:t,factory:t.\u0275fac})}return t})();var qe=new W("TAG_INSTANCE"),ht=(()=>{class t extends ce{componentName="Tag";$pcTag=V(qe,{optional:!0,skipSelf:!0})??void 0;bindDirectiveInstance=V(M,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}styleClass;severity;value;icon;rounded;iconTemplate;templates;_iconTemplate;_componentStyle=V(Ke);onAfterContentInit(){this.templates?.forEach(e=>{e.getType()==="icon"&&(this._iconTemplate=e.template)})}get dataP(){return this.cn({rounded:this.rounded,[this.severity]:this.severity})}static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["p-tag"]],contentQueries:function(i,n,a){if(i&1&&ee(a,lt,4)(a,K,4),i&2){let r;D(r=L())&&(n.iconTemplate=r.first),D(r=L())&&(n.templates=r)}},hostVars:3,hostBindings:function(i,n){i&2&&(P("data-p",n.dataP),g(n.cn(n.cx("root"),n.styleClass)))},inputs:{styleClass:"styleClass",severity:"severity",value:"value",icon:"icon",rounded:[2,"rounded","rounded",v]},features:[ne([Ke,{provide:qe,useExisting:t},{provide:pe,useExisting:t}]),Y([M]),T],ngContentSelectors:ut,decls:5,vars:6,consts:[[4,"ngIf"],[3,"class","pBind",4,"ngIf"],[3,"pBind"],[3,"class","ngClass","pBind",4,"ngIf"],[3,"ngClass","pBind"],[4,"ngTemplateOutlet"]],template:function(i,n){i&1&&(ye(),Ie(0),c(1,dt,2,1,"ng-container",0)(2,ft,2,4,"span",1),b(3,"span",2),te(4),x()),i&2&&(u(),o("ngIf",!n.iconTemplate&&!n._iconTemplate),u(),o("ngIf",n.iconTemplate||n._iconTemplate),u(),g(n.cx("label")),o("pBind",n.ptm("label")),u(),le(n.value))},dependencies:[oe,ue,ae,re,F,M],encapsulation:2,changeDetection:0})}return t})(),hi=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=X({type:t});static \u0275inj=Z({imports:[ht,F,F]})}return t})();var bt=["data-p-icon","angle-double-left"],Ze=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["","data-p-icon","angle-double-left"]],features:[T],attrs:bt,decls:1,vars:0,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M5.71602 11.164C5.80782 11.2021 5.9063 11.2215 6.00569 11.221C6.20216 11.2301 6.39427 11.1612 6.54025 11.0294C6.68191 10.8875 6.76148 10.6953 6.76148 10.4948C6.76148 10.2943 6.68191 10.1021 6.54025 9.96024L3.51441 6.9344L6.54025 3.90855C6.624 3.76126 6.65587 3.59011 6.63076 3.42254C6.60564 3.25498 6.525 3.10069 6.40175 2.98442C6.2785 2.86815 6.11978 2.79662 5.95104 2.7813C5.78229 2.76598 5.61329 2.80776 5.47112 2.89994L1.97123 6.39983C1.82957 6.54167 1.75 6.73393 1.75 6.9344C1.75 7.13486 1.82957 7.32712 1.97123 7.46896L5.47112 10.9991C5.54096 11.0698 5.62422 11.1259 5.71602 11.164ZM11.0488 10.9689C11.1775 11.1156 11.3585 11.2061 11.5531 11.221C11.7477 11.2061 11.9288 11.1156 12.0574 10.9689C12.1815 10.8302 12.25 10.6506 12.25 10.4645C12.25 10.2785 12.1815 10.0989 12.0574 9.96024L9.03158 6.93439L12.0574 3.90855C12.1248 3.76739 12.1468 3.60881 12.1204 3.45463C12.0939 3.30045 12.0203 3.15826 11.9097 3.04765C11.7991 2.93703 11.6569 2.86343 11.5027 2.83698C11.3486 2.81053 11.19 2.83252 11.0488 2.89994L7.51865 6.36957C7.37699 6.51141 7.29742 6.70367 7.29742 6.90414C7.29742 7.1046 7.37699 7.29686 7.51865 7.4387L11.0488 10.9689Z","fill","currentColor"]],template:function(i,n){i&1&&(y(),N(0,"path",0))},encapsulation:2})}return t})();var xt=["data-p-icon","angle-double-right"],We=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["","data-p-icon","angle-double-right"]],features:[T],attrs:xt,decls:1,vars:0,consts:[["fill-rule","evenodd","clip-rule","evenodd","d","M7.68757 11.1451C7.7791 11.1831 7.8773 11.2024 7.9764 11.2019C8.07769 11.1985 8.17721 11.1745 8.26886 11.1312C8.36052 11.088 8.44238 11.0265 8.50943 10.9505L12.0294 7.49085C12.1707 7.34942 12.25 7.15771 12.25 6.95782C12.25 6.75794 12.1707 6.56622 12.0294 6.42479L8.50943 2.90479C8.37014 2.82159 8.20774 2.78551 8.04633 2.80192C7.88491 2.81833 7.73309 2.88635 7.6134 2.99588C7.4937 3.10541 7.41252 3.25061 7.38189 3.40994C7.35126 3.56927 7.37282 3.73423 7.44337 3.88033L10.4605 6.89748L7.44337 9.91463C7.30212 10.0561 7.22278 10.2478 7.22278 10.4477C7.22278 10.6475 7.30212 10.8393 7.44337 10.9807C7.51301 11.0512 7.59603 11.1071 7.68757 11.1451ZM1.94207 10.9505C2.07037 11.0968 2.25089 11.1871 2.44493 11.2019C2.63898 11.1871 2.81949 11.0968 2.94779 10.9505L6.46779 7.49085C6.60905 7.34942 6.68839 7.15771 6.68839 6.95782C6.68839 6.75793 6.60905 6.56622 6.46779 6.42479L2.94779 2.90479C2.80704 2.83757 2.6489 2.81563 2.49517 2.84201C2.34143 2.86839 2.19965 2.94178 2.08936 3.05207C1.97906 3.16237 1.90567 3.30415 1.8793 3.45788C1.85292 3.61162 1.87485 3.76975 1.94207 3.9105L4.95922 6.92765L1.94207 9.9448C1.81838 10.0831 1.75 10.2621 1.75 10.4477C1.75 10.6332 1.81838 10.8122 1.94207 10.9505Z","fill","currentColor"]],template:function(i,n){i&1&&(y(),N(0,"path",0))},encapsulation:2})}return t})();var yt=["data-p-icon","angle-down"],Xe=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["","data-p-icon","angle-down"]],features:[T],attrs:yt,decls:1,vars:0,consts:[["d","M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z","fill","currentColor"]],template:function(i,n){i&1&&(y(),N(0,"path",0))},encapsulation:2})}return t})();var It=["data-p-icon","angle-left"],Ye=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["","data-p-icon","angle-left"]],features:[T],attrs:It,decls:1,vars:0,consts:[["d","M8.75 11.185C8.65146 11.1854 8.55381 11.1662 8.4628 11.1284C8.37179 11.0906 8.28924 11.0351 8.22 10.965L4.72 7.46496C4.57955 7.32433 4.50066 7.13371 4.50066 6.93496C4.50066 6.73621 4.57955 6.54558 4.72 6.40496L8.22 2.93496C8.36095 2.84357 8.52851 2.80215 8.69582 2.81733C8.86312 2.83252 9.02048 2.90344 9.14268 3.01872C9.26487 3.134 9.34483 3.28696 9.36973 3.4531C9.39463 3.61924 9.36303 3.78892 9.28 3.93496L6.28 6.93496L9.28 9.93496C9.42045 10.0756 9.49934 10.2662 9.49934 10.465C9.49934 10.6637 9.42045 10.8543 9.28 10.995C9.13526 11.1257 8.9448 11.1939 8.75 11.185Z","fill","currentColor"]],template:function(i,n){i&1&&(y(),N(0,"path",0))},encapsulation:2})}return t})();var Ct=["data-p-icon","angle-right"],et=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["","data-p-icon","angle-right"]],features:[T],attrs:Ct,decls:1,vars:0,consts:[["d","M5.25 11.1728C5.14929 11.1694 5.05033 11.1455 4.9592 11.1025C4.86806 11.0595 4.78666 10.9984 4.72 10.9228C4.57955 10.7822 4.50066 10.5916 4.50066 10.3928C4.50066 10.1941 4.57955 10.0035 4.72 9.86283L7.72 6.86283L4.72 3.86283C4.66067 3.71882 4.64765 3.55991 4.68275 3.40816C4.71785 3.25642 4.79932 3.11936 4.91585 3.01602C5.03238 2.91268 5.17819 2.84819 5.33305 2.83149C5.4879 2.81479 5.64411 2.84671 5.78 2.92283L9.28 6.42283C9.42045 6.56346 9.49934 6.75408 9.49934 6.95283C9.49934 7.15158 9.42045 7.34221 9.28 7.48283L5.78 10.9228C5.71333 10.9984 5.63193 11.0595 5.5408 11.1025C5.44966 11.1455 5.35071 11.1694 5.25 11.1728Z","fill","currentColor"]],template:function(i,n){i&1&&(y(),N(0,"path",0))},encapsulation:2})}return t})();var wt=["data-p-icon","angle-up"],tt=(()=>{class t extends R{static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275cmp=w({type:t,selectors:[["","data-p-icon","angle-up"]],features:[T],attrs:wt,decls:1,vars:0,consts:[["d","M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z","fill","currentColor"]],template:function(i,n){i&1&&(y(),N(0,"path",0))},encapsulation:2})}return t})();var nt=`
    .p-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .p-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .p-inputnumber-button:disabled {
        cursor: auto;
    }

    .p-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .p-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .p-inputnumber-stacked .p-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .p-inputnumber-stacked .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .p-inputnumber-stacked .p-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-horizontal .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .p-inputnumber-horizontal .p-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .p-inputnumber-horizontal .p-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .p-floatlabel:has(.p-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .p-inputnumber-vertical {
        flex-direction: column;
    }

    .p-inputnumber-vertical .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .p-inputnumber-vertical .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .p-inputnumber-vertical .p-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .p-inputnumber-vertical .p-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .p-inputnumber-input {
        flex: 1 1 auto;
    }

    .p-inputnumber-fluid {
        width: 100%;
    }

    .p-inputnumber-fluid .p-inputnumber-input {
        width: 1%;
    }

    .p-inputnumber-fluid.p-inputnumber-vertical .p-inputnumber-input {
        width: 100%;
    }

    .p-inputnumber:has(.p-inputtext-sm) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-inputnumber:has(.p-inputtext-lg) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-inputnumber:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-stacked .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-stacked:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-horizontal .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`;var Tt=["clearicon"],vt=["incrementbuttonicon"],Pt=["decrementbuttonicon"],Bt=["input"];function kt(t,s){if(t&1){let e=E();y(),b(0,"svg",7),B("click",function(){f(e);let n=p(2);return _(n.clear())}),x()}if(t&2){let e=p(2);g(e.cx("clearIcon")),o("pBind",e.ptm("clearIcon"))}}function St(t,s){}function Dt(t,s){t&1&&c(0,St,0,0,"ng-template")}function Lt(t,s){if(t&1){let e=E();b(0,"span",8),B("click",function(){f(e);let n=p(2);return _(n.clear())}),c(1,Dt,1,0,null,9),x()}if(t&2){let e=p(2);g(e.cx("clearIcon")),o("pBind",e.ptm("clearIcon")),u(),o("ngTemplateOutlet",e.clearIconTemplate||e._clearIconTemplate)}}function Mt(t,s){if(t&1&&(A(0),c(1,kt,1,3,"svg",5)(2,Lt,2,4,"span",6),O()),t&2){let e=p();u(),o("ngIf",!e.clearIconTemplate&&!e._clearIconTemplate),u(),o("ngIf",e.clearIconTemplate||e._clearIconTemplate)}}function Et(t,s){if(t&1&&S(0,"span",13),t&2){let e=p(2);o("pBind",e.ptm("incrementButtonIcon"))("ngClass",e.incrementButtonIcon)}}function Vt(t,s){if(t&1&&(y(),S(0,"svg",15)),t&2){let e=p(3);o("pBind",e.ptm("incrementButtonIcon"))}}function Nt(t,s){}function Ft(t,s){t&1&&c(0,Nt,0,0,"ng-template")}function Rt(t,s){if(t&1&&(A(0),c(1,Vt,1,1,"svg",14)(2,Ft,1,0,null,9),O()),t&2){let e=p(2);u(),o("ngIf",!e.incrementButtonIconTemplate&&!e._incrementButtonIconTemplate),u(),o("ngTemplateOutlet",e.incrementButtonIconTemplate||e._incrementButtonIconTemplate)}}function At(t,s){if(t&1&&S(0,"span",13),t&2){let e=p(2);o("pBind",e.ptm("decrementButtonIcon"))("ngClass",e.decrementButtonIcon)}}function Ot(t,s){if(t&1&&(y(),S(0,"svg",17)),t&2){let e=p(3);o("pBind",e.ptm("decrementButtonIcon"))}}function jt(t,s){}function zt(t,s){t&1&&c(0,jt,0,0,"ng-template")}function $t(t,s){if(t&1&&(A(0),c(1,Ot,1,1,"svg",16)(2,zt,1,0,null,9),O()),t&2){let e=p(2);u(),o("ngIf",!e.decrementButtonIconTemplate&&!e._decrementButtonIconTemplate),u(),o("ngTemplateOutlet",e.decrementButtonIconTemplate||e._decrementButtonIconTemplate)}}function Ut(t,s){if(t&1){let e=E();b(0,"span",10)(1,"button",11),B("mousedown",function(n){f(e);let a=p();return _(a.onUpButtonMouseDown(n))})("mouseup",function(){f(e);let n=p();return _(n.onUpButtonMouseUp())})("mouseleave",function(){f(e);let n=p();return _(n.onUpButtonMouseLeave())})("keydown",function(n){f(e);let a=p();return _(a.onUpButtonKeyDown(n))})("keyup",function(){f(e);let n=p();return _(n.onUpButtonKeyUp())}),c(2,Et,1,2,"span",12)(3,Rt,3,2,"ng-container",2),x(),b(4,"button",11),B("mousedown",function(n){f(e);let a=p();return _(a.onDownButtonMouseDown(n))})("mouseup",function(){f(e);let n=p();return _(n.onDownButtonMouseUp())})("mouseleave",function(){f(e);let n=p();return _(n.onDownButtonMouseLeave())})("keydown",function(n){f(e);let a=p();return _(a.onDownButtonKeyDown(n))})("keyup",function(){f(e);let n=p();return _(n.onDownButtonKeyUp())}),c(5,At,1,2,"span",12)(6,$t,3,2,"ng-container",2),x()()}if(t&2){let e=p();g(e.cx("buttonGroup")),o("pBind",e.ptm("buttonGroup")),P("data-p",e.dataP),u(),g(e.cn(e.cx("incrementButton"),e.incrementButtonClass)),o("pBind",e.ptm("incrementButton")),P("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-p",e.dataP),u(),o("ngIf",e.incrementButtonIcon),u(),o("ngIf",!e.incrementButtonIcon),u(),g(e.cn(e.cx("decrementButton"),e.decrementButtonClass)),o("pBind",e.ptm("decrementButton")),P("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-p",e.dataP),u(),o("ngIf",e.decrementButtonIcon),u(),o("ngIf",!e.decrementButtonIcon)}}function Gt(t,s){if(t&1&&S(0,"span",13),t&2){let e=p(2);o("pBind",e.ptm("incrementButtonIcon"))("ngClass",e.incrementButtonIcon)}}function Qt(t,s){if(t&1&&(y(),S(0,"svg",15)),t&2){let e=p(3);o("pBind",e.ptm("incrementButtonIcon"))}}function Kt(t,s){}function qt(t,s){t&1&&c(0,Kt,0,0,"ng-template")}function Ht(t,s){if(t&1&&(A(0),c(1,Qt,1,1,"svg",14)(2,qt,1,0,null,9),O()),t&2){let e=p(2);u(),o("ngIf",!e.incrementButtonIconTemplate&&!e._incrementButtonIconTemplate),u(),o("ngTemplateOutlet",e.incrementButtonIconTemplate||e._incrementButtonIconTemplate)}}function Jt(t,s){if(t&1){let e=E();b(0,"button",11),B("mousedown",function(n){f(e);let a=p();return _(a.onUpButtonMouseDown(n))})("mouseup",function(){f(e);let n=p();return _(n.onUpButtonMouseUp())})("mouseleave",function(){f(e);let n=p();return _(n.onUpButtonMouseLeave())})("keydown",function(n){f(e);let a=p();return _(a.onUpButtonKeyDown(n))})("keyup",function(){f(e);let n=p();return _(n.onUpButtonKeyUp())}),c(1,Gt,1,2,"span",12)(2,Ht,3,2,"ng-container",2),x()}if(t&2){let e=p();g(e.cn(e.cx("incrementButton"),e.incrementButtonClass)),o("pBind",e.ptm("incrementButton")),P("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-p",e.dataP),u(),o("ngIf",e.incrementButtonIcon),u(),o("ngIf",!e.incrementButtonIcon)}}function Zt(t,s){if(t&1&&S(0,"span",13),t&2){let e=p(2);o("pBind",e.ptm("decrementButtonIcon"))("ngClass",e.decrementButtonIcon)}}function Wt(t,s){if(t&1&&(y(),S(0,"svg",17)),t&2){let e=p(3);o("pBind",e.ptm("decrementButtonIcon"))}}function Xt(t,s){}function Yt(t,s){t&1&&c(0,Xt,0,0,"ng-template")}function en(t,s){if(t&1&&(A(0),c(1,Wt,1,1,"svg",16)(2,Yt,1,0,null,9),O()),t&2){let e=p(2);u(),o("ngIf",!e.decrementButtonIconTemplate&&!e._decrementButtonIconTemplate),u(),o("ngTemplateOutlet",e.decrementButtonIconTemplate||e._decrementButtonIconTemplate)}}function tn(t,s){if(t&1){let e=E();b(0,"button",11),B("mousedown",function(n){f(e);let a=p();return _(a.onDownButtonMouseDown(n))})("mouseup",function(){f(e);let n=p();return _(n.onDownButtonMouseUp())})("mouseleave",function(){f(e);let n=p();return _(n.onDownButtonMouseLeave())})("keydown",function(n){f(e);let a=p();return _(a.onDownButtonKeyDown(n))})("keyup",function(){f(e);let n=p();return _(n.onDownButtonKeyUp())}),c(1,Zt,1,2,"span",12)(2,en,3,2,"ng-container",2),x()}if(t&2){let e=p();g(e.cn(e.cx("decrementButton"),e.decrementButtonClass)),o("pBind",e.ptm("decrementButton")),P("disabled",e.$disabled()?"":void 0)("aria-hidden",!0)("data-p",e.dataP),u(),o("ngIf",e.decrementButtonIcon),u(),o("ngIf",!e.decrementButtonIcon)}}var nn=`
    ${nt}

    /* For PrimeNG */
    p-inputNumber.ng-invalid.ng-dirty > .p-inputtext,
    p-input-number.ng-invalid.ng-dirty > .p-inputtext,
    p-inputnumber.ng-invalid.ng-dirty > .p-inputtext {
        border-color: dt('inputtext.invalid.border.color');
    }

    p-inputNumber.ng-invalid.ng-dirty > .p-inputtext:enabled:focus,
    p-input-number.ng-invalid.ng-dirty > .p-inputtext:enabled:focus,
    p-inputnumber.ng-invalid.ng-dirty > .p-inputtext:enabled:focus {
        border-color: dt('inputtext.focus.border.color');
    }

    p-inputNumber.ng-invalid.ng-dirty > .p-inputtext::placeholder,
    p-input-number.ng-invalid.ng-dirty > .p-inputtext::placeholder,
    p-inputnumber.ng-invalid.ng-dirty > .p-inputtext::placeholder {
        color: dt('inputtext.invalid.placeholder.color');
    }
`,an={root:({instance:t})=>["p-inputnumber p-component p-inputwrapper",{"p-inputwrapper-filled":t.$filled()||t.allowEmpty===!1,"p-inputwrapper-focus":t.focused,"p-inputnumber-stacked":t.showButtons&&t.buttonLayout==="stacked","p-inputnumber-horizontal":t.showButtons&&t.buttonLayout==="horizontal","p-inputnumber-vertical":t.showButtons&&t.buttonLayout==="vertical","p-inputnumber-fluid":t.hasFluid,"p-invalid":t.invalid()}],pcInputText:"p-inputnumber-input",buttonGroup:"p-inputnumber-button-group",incrementButton:({instance:t})=>["p-inputnumber-button p-inputnumber-increment-button",{"p-disabled":t.showButtons&&t.max()!=null&&t.maxlength()}],decrementButton:({instance:t})=>["p-inputnumber-button p-inputnumber-decrement-button",{"p-disabled":t.showButtons&&t.min()!=null&&t.minlength()}],clearIcon:"p-inputnumber-clear-icon"},it=(()=>{class t extends se{name="inputnumber";style=nn;classes=an;static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275prov=J({token:t,factory:t.\u0275fac})}return t})();var at=new W("INPUTNUMBER_INSTANCE"),rn={provide:Me,useExisting:he(()=>de),multi:!0},de=(()=>{class t extends je{injector;componentName="InputNumber";$pcInputNumber=V(at,{optional:!0,skipSelf:!0})??void 0;_componentStyle=V(it);bindDirectiveInstance=V(M,{self:!0});onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}showButtons=!1;format=!0;buttonLayout="stacked";inputId;styleClass;placeholder;tabindex;title;ariaLabelledBy;ariaDescribedBy;ariaLabel;ariaRequired;autocomplete;incrementButtonClass;decrementButtonClass;incrementButtonIcon;decrementButtonIcon;readonly;allowEmpty=!0;locale;localeMatcher;mode="decimal";currency;currencyDisplay;useGrouping=!0;minFractionDigits;maxFractionDigits;prefix;suffix;inputStyle;inputStyleClass;showClear=!1;autofocus;onInput=new G;onFocus=new G;onBlur=new G;onKeyDown=new G;onClear=new G;clearIconTemplate;incrementButtonIconTemplate;decrementButtonIconTemplate;templates;input;_clearIconTemplate;_incrementButtonIconTemplate;_decrementButtonIconTemplate;value;focused;initialized;groupChar="";prefixChar="";suffixChar="";isSpecialChar;timer;lastValue;_numeral;numberFormat;_decimal;_decimalChar="";_group;_minusSign;_currency;_prefix;_suffix;_index;ngControl=null;constructor(e){super(),this.injector=e}onChanges(e){["locale","localeMatcher","mode","currency","currencyDisplay","useGrouping","minFractionDigits","maxFractionDigits","prefix","suffix"].some(n=>!!e[n])&&this.updateConstructParser()}onInit(){this.ngControl=this.injector.get(Ee,null,{optional:!0}),this.constructParser(),this.initialized=!0}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"clearicon":this._clearIconTemplate=e.template;break;case"incrementbuttonicon":this._incrementButtonIconTemplate=e.template;break;case"decrementbuttonicon":this._decrementButtonIconTemplate=e.template;break}})}getOptions(){let e=(r,l,d)=>{if(!(r==null||isNaN(r)||!isFinite(r)))return Math.max(l,Math.min(d,Math.floor(r)))},i=e(this.minFractionDigits,0,20),n=e(this.maxFractionDigits,0,100),a=i!=null&&n!=null&&i>n?n:i;return{localeMatcher:this.localeMatcher,style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,useGrouping:this.useGrouping,minimumFractionDigits:a,maximumFractionDigits:n}}constructParser(){let e=this.getOptions(),i=Object.fromEntries(Object.entries(e).filter(([r,l])=>l!==void 0));this.numberFormat=new Intl.NumberFormat(this.locale,i);let n=[...new Intl.NumberFormat(this.locale,{useGrouping:!1}).format(9876543210)].reverse(),a=new Map(n.map((r,l)=>[r,l]));this._numeral=new RegExp(`[${n.join("")}]`,"g"),this._group=this.getGroupingExpression(),this._minusSign=this.getMinusSignExpression(),this._currency=this.getCurrencyExpression(),this._decimal=this.getDecimalExpression(),this._decimalChar=this.getDecimalChar(),this._suffix=this.getSuffixExpression(),this._prefix=this.getPrefixExpression(),this._index=r=>a.get(r)}updateConstructParser(){this.initialized&&this.constructParser()}escapeRegExp(e){return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")}getDecimalExpression(){let e=this.getDecimalChar();return new RegExp(`[${e}]`,"g")}getDecimalChar(){return new Intl.NumberFormat(this.locale,_e(fe({},this.getOptions()),{useGrouping:!1})).format(1.1).replace(this._currency,"").trim().replace(this._numeral,"")}getGroupingExpression(){let e=new Intl.NumberFormat(this.locale,{useGrouping:!0});return this.groupChar=e.format(1e6).trim().replace(this._numeral,"").charAt(0),new RegExp(`[${this.groupChar}]`,"g")}getMinusSignExpression(){let e=new Intl.NumberFormat(this.locale,{useGrouping:!1});return new RegExp(`[${e.format(-1).trim().replace(this._numeral,"")}]`,"g")}getCurrencyExpression(){if(this.currency){let e=new Intl.NumberFormat(this.locale,{style:"currency",currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0});return new RegExp(`[${e.format(1).replace(/\s/g,"").replace(this._numeral,"").replace(this._group,"")}]`,"g")}return new RegExp("[]","g")}getPrefixExpression(){if(this.prefix)this.prefixChar=this.prefix;else{let e=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay});this.prefixChar=e.format(1).split("1")[0]}return new RegExp(`${this.escapeRegExp(this.prefixChar||"")}`,"g")}getSuffixExpression(){if(this.suffix)this.suffixChar=this.suffix;else{let e=new Intl.NumberFormat(this.locale,{style:this.mode,currency:this.currency,currencyDisplay:this.currencyDisplay,minimumFractionDigits:0,maximumFractionDigits:0});this.suffixChar=e.format(1).split("1")[1]}return new RegExp(`${this.escapeRegExp(this.suffixChar||"")}`,"g")}formatValue(e){if(e!=null){if(e==="-")return e;if(this.format){let n=new Intl.NumberFormat(this.locale,this.getOptions()).format(e);return this.prefix&&e!=this.prefix&&(n=this.prefix+n),this.suffix&&e!=this.suffix&&(n=n+this.suffix),n}return e.toString()}return""}parseValue(e){let i=this._suffix?new RegExp(this._suffix,""):/(?:)/,n=this._prefix?new RegExp(this._prefix,""):/(?:)/,a=this._currency?new RegExp(this._currency,""):/(?:)/,r=e.replace(i,"").replace(n,"").trim().replace(/\s/g,"").replace(a,"").replace(this._group,"").replace(this._minusSign,"-").replace(this._decimal,".").replace(this._numeral,this._index);if(r){if(r==="-")return r;let l=+r;return isNaN(l)?null:l}return null}repeat(e,i,n){if(this.readonly)return;let a=i||500;this.clearTimer(),this.timer=setTimeout(()=>{this.repeat(e,40,n)},a),this.spin(e,n)}spin(e,i){let n=(this.step()??1)*i,a=this.parseValue(this.input?.nativeElement.value)||0,r=this.validateValue(a+n),l=this.maxlength();l&&l<this.formatValue(r).length||(this.updateInput(r,null,"spin",null),this.updateModel(e,r),this.handleOnInput(e,a,r))}clear(){this.value=null,this.onModelChange(this.value),this.onClear.emit()}onUpButtonMouseDown(e){if(e.button===2){this.clearTimer();return}this.$disabled()||(this.input?.nativeElement.focus(),this.repeat(e,null,1),e.preventDefault())}onUpButtonMouseUp(){this.$disabled()||this.clearTimer()}onUpButtonMouseLeave(){this.$disabled()||this.clearTimer()}onUpButtonKeyDown(e){(e.keyCode===32||e.keyCode===13)&&this.repeat(e,null,1)}onUpButtonKeyUp(){this.$disabled()||this.clearTimer()}onDownButtonMouseDown(e){if(e.button===2){this.clearTimer();return}this.$disabled()||(this.input?.nativeElement.focus(),this.repeat(e,null,-1),e.preventDefault())}onDownButtonMouseUp(){this.$disabled()||this.clearTimer()}onDownButtonMouseLeave(){this.$disabled()||this.clearTimer()}onDownButtonKeyUp(){this.$disabled()||this.clearTimer()}onDownButtonKeyDown(e){(e.keyCode===32||e.keyCode===13)&&this.repeat(e,null,-1)}onUserInput(e){this.readonly||(this.isSpecialChar&&(e.target.value=this.lastValue),this.isSpecialChar=!1)}onInputKeyDown(e){if(this.readonly)return;if(this.lastValue=e.target.value,e.shiftKey||e.altKey){this.isSpecialChar=!0;return}let i=e.target.selectionStart,n=e.target.selectionEnd,a=e.target.value,r=null;switch(e.altKey&&e.preventDefault(),e.key){case"ArrowUp":this.spin(e,1),e.preventDefault();break;case"ArrowDown":this.spin(e,-1),e.preventDefault();break;case"ArrowLeft":for(let l=i;l<=a.length;l++){let d=l===0?0:l-1;if(this.isNumeralChar(a.charAt(d))){this.input.nativeElement.setSelectionRange(l,l);break}}break;case"ArrowRight":for(let l=n;l>=0;l--)if(this.isNumeralChar(a.charAt(l))){this.input.nativeElement.setSelectionRange(l,l);break}break;case"Tab":case"Enter":r=this.validateValue(this.parseValue(this.input.nativeElement.value)),this.input.nativeElement.value=this.formatValue(r),this.input.nativeElement.setAttribute("aria-valuenow",r),this.updateModel(e,r);break;case"Backspace":{if(e.preventDefault(),i===n){if(i==1&&this.prefix||i==a.length&&this.suffix)break;let l=a.charAt(i-1),{decimalCharIndex:d,decimalCharIndexWithoutPrefix:h}=this.getDecimalCharIndexes(a);if(this.isNumeralChar(l)){let m=this.getDecimalLength(a);if(this._group.test(l))this._group.lastIndex=0,r=a.slice(0,i-2)+a.slice(i-1);else if(this._decimal.test(l))this._decimal.lastIndex=0,m?this.input?.nativeElement.setSelectionRange(i-1,i-1):r=a.slice(0,i-1)+a.slice(i);else if(d>0&&i>d){let k=this.isDecimalMode()&&(this.minFractionDigits||0)<m?"":"0";r=a.slice(0,i-1)+k+a.slice(i)}else h===1?(r=a.slice(0,i-1)+"0"+a.slice(i),r=this.parseValue(r)>0?r:""):r=a.slice(0,i-1)+a.slice(i)}else this.mode==="currency"&&this._currency&&l.search(this._currency)!=-1&&(r=a.slice(1));this.updateValue(e,r,null,"delete-single")}else r=this.deleteRange(a,i,n),this.updateValue(e,r,null,"delete-range");break}case"Delete":if(e.preventDefault(),i===n){if(i==0&&this.prefix||i==a.length-1&&this.suffix)break;let l=a.charAt(i),{decimalCharIndex:d,decimalCharIndexWithoutPrefix:h}=this.getDecimalCharIndexes(a);if(this.isNumeralChar(l)){let m=this.getDecimalLength(a);if(this._group.test(l))this._group.lastIndex=0,r=a.slice(0,i)+a.slice(i+2);else if(this._decimal.test(l))this._decimal.lastIndex=0,m?this.input?.nativeElement.setSelectionRange(i+1,i+1):r=a.slice(0,i)+a.slice(i+1);else if(d>0&&i>d){let k=this.isDecimalMode()&&(this.minFractionDigits||0)<m?"":"0";r=a.slice(0,i)+k+a.slice(i+1)}else h===1?(r=a.slice(0,i)+"0"+a.slice(i+1),r=this.parseValue(r)>0?r:""):r=a.slice(0,i)+a.slice(i+1)}this.updateValue(e,r,null,"delete-back-single")}else r=this.deleteRange(a,i,n),this.updateValue(e,r,null,"delete-range");break;case"Home":this.min()&&(this.updateModel(e,this.min()),e.preventDefault());break;case"End":this.max()&&(this.updateModel(e,this.max()),e.preventDefault());break;default:break}this.onKeyDown.emit(e)}onInputKeyPress(e){if(this.readonly)return;let i=e.which||e.keyCode,n=String.fromCharCode(i),a=this.isDecimalSign(n),r=this.isMinusSign(n);i!=13&&e.preventDefault(),!a&&e.code==="NumpadDecimal"&&(a=!0,n=this._decimalChar,i=n.charCodeAt(0));let{value:l,selectionStart:d,selectionEnd:h}=this.input.nativeElement,m=this.parseValue(l+n),k=m!=null?m.toString():"",U=l.substring(d,h),I=this.parseValue(U),z=I!=null?I.toString():"";if(d!==h&&z.length>0){this.insert(e,n,{isDecimalSign:a,isMinusSign:r});return}let j=this.maxlength();j&&k.length>j||(48<=i&&i<=57||r||a)&&this.insert(e,n,{isDecimalSign:a,isMinusSign:r})}onPaste(e){if(!this.$disabled()&&!this.readonly){e.preventDefault();let i=(e.clipboardData||this.document.defaultView.clipboardData).getData("Text");if(this.inputId==="integeronly"&&/[^\d-]/.test(i))return;if(i){this.maxlength()&&(i=i.toString().substring(0,this.maxlength()));let n=this.parseValue(i);n!=null&&this.insert(e,n.toString())}}}allowMinusSign(){let e=this.min();return e==null||e<0}isMinusSign(e){return this._minusSign.test(e)||e==="-"?(this._minusSign.lastIndex=0,!0):!1}isDecimalSign(e){return this._decimal.test(e)?(this._decimal.lastIndex=0,!0):!1}isDecimalMode(){return this.mode==="decimal"}getDecimalCharIndexes(e){let i=e.search(this._decimal);this._decimal.lastIndex=0;let a=e.replace(this._prefix,"").trim().replace(/\s/g,"").replace(this._currency,"").search(this._decimal);return this._decimal.lastIndex=0,{decimalCharIndex:i,decimalCharIndexWithoutPrefix:a}}getCharIndexes(e){let i=e.search(this._decimal);this._decimal.lastIndex=0;let n=e.search(this._minusSign);this._minusSign.lastIndex=0;let a=e.search(this._suffix);this._suffix.lastIndex=0;let r=e.search(this._currency);return this._currency.lastIndex=0,{decimalCharIndex:i,minusCharIndex:n,suffixCharIndex:a,currencyCharIndex:r}}insert(e,i,n={isDecimalSign:!1,isMinusSign:!1}){let a=i.search(this._minusSign);if(this._minusSign.lastIndex=0,!this.allowMinusSign()&&a!==-1)return;let r=this.input?.nativeElement.selectionStart,l=this.input?.nativeElement.selectionEnd,d=this.input?.nativeElement.value.trim(),{decimalCharIndex:h,minusCharIndex:m,suffixCharIndex:k,currencyCharIndex:U}=this.getCharIndexes(d),I;if(n.isMinusSign)r===0&&(I=d,(m===-1||l!==0)&&(I=this.insertText(d,i,0,l)),this.updateValue(e,I,i,"insert"));else if(n.isDecimalSign)h>0&&r===h?this.updateValue(e,d,i,"insert"):h>r&&h<l?(I=this.insertText(d,i,r,l),this.updateValue(e,I,i,"insert")):h===-1&&this.maxFractionDigits&&(I=this.insertText(d,i,r,l),this.updateValue(e,I,i,"insert"));else{let z=this.numberFormat.resolvedOptions().maximumFractionDigits,j=r!==l?"range-insert":"insert";if(h>0&&r>h){if(r+i.length-(h+1)<=z){let $=U>=r?U-1:k>=r?k:d.length;I=d.slice(0,r)+i+d.slice(r+i.length,$)+d.slice($),this.updateValue(e,I,i,j)}}else I=this.insertText(d,i,r,l),this.updateValue(e,I,i,j)}}insertText(e,i,n,a){if((i==="."?i:i.split(".")).length===2){let l=e.slice(n,a).search(this._decimal);return this._decimal.lastIndex=0,l>0?e.slice(0,n)+this.formatValue(i)+e.slice(a):e||this.formatValue(i)}else return a-n===e.length?this.formatValue(i):n===0?i+e.slice(a):a===e.length?e.slice(0,n)+i:e.slice(0,n)+i+e.slice(a)}deleteRange(e,i,n){let a;return n-i===e.length?a="":i===0?a=e.slice(n):n===e.length?a=e.slice(0,i):a=e.slice(0,i)+e.slice(n),a}initCursor(){let e=this.input?.nativeElement.selectionStart,i=this.input?.nativeElement.selectionEnd,n=this.input?.nativeElement.value,a=n.length,r=null,l=(this.prefixChar||"").length;n=n.replace(this._prefix,""),(e===i||e!==0||i<l)&&(e-=l);let d=n.charAt(e);if(this.isNumeralChar(d))return e+l;let h=e-1;for(;h>=0;)if(d=n.charAt(h),this.isNumeralChar(d)){r=h+l;break}else h--;if(r!==null)this.input?.nativeElement.setSelectionRange(r+1,r+1);else{for(h=e;h<a;)if(d=n.charAt(h),this.isNumeralChar(d)){r=h+l;break}else h++;r!==null&&this.input?.nativeElement.setSelectionRange(r,r)}return r||0}onInputClick(){let e=this.input?.nativeElement.value;!this.readonly&&e!==Re()&&this.initCursor()}isNumeralChar(e){return e.length===1&&(this._numeral.test(e)||this._decimal.test(e)||this._group.test(e)||this._minusSign.test(e))?(this.resetRegex(),!0):!1}resetRegex(){this._numeral.lastIndex=0,this._decimal.lastIndex=0,this._group.lastIndex=0,this._minusSign.lastIndex=0}updateValue(e,i,n,a){let r=this.input?.nativeElement.value,l=null;i!=null&&(l=this.parseValue(i),l=!l&&!this.allowEmpty?0:l,this.updateInput(l,n,a,i),this.handleOnInput(e,r,l))}handleOnInput(e,i,n){this.isValueChanged(i,n)&&(this.input.nativeElement.value=this.formatValue(n),this.input?.nativeElement.setAttribute("aria-valuenow",n),this.updateModel(e,n),this.onInput.emit({originalEvent:e,value:n,formattedValue:i}))}isValueChanged(e,i){if(i===null&&e!==null)return!0;if(i!=null){let n=typeof e=="string"?this.parseValue(e):e;return i!==n}return!1}validateValue(e){if(e==="-"||e==null)return null;let i=this.min(),n=this.max();return i!=null&&e<i?this.min():n!=null&&e>n?n:e}updateInput(e,i,n,a){i=i||"";let r=this.input?.nativeElement.value,l=this.formatValue(e),d=r.length;if(l!==a&&(l=this.concatValues(l,a)),d===0){this.input.nativeElement.value=l,this.input.nativeElement.setSelectionRange(0,0);let m=this.initCursor()+i.length;this.input.nativeElement.setSelectionRange(m,m)}else{let h=this.input.nativeElement.selectionStart,m=this.input.nativeElement.selectionEnd,k=this.maxlength();if(k&&l.length>k&&(l=l.slice(0,k),h=Math.min(h,k),m=Math.min(m,k)),k&&k<l.length)return;this.input.nativeElement.value=l;let U=l.length;if(n==="range-insert"){let I=this.parseValue((r||"").slice(0,h)),j=(I!==null?I.toString():"").split("").join(`(${this.groupChar})?`),$=new RegExp(j,"g");$.test(l);let pt=i.split("").join(`(${this.groupChar})?`),ge=new RegExp(pt,"g");ge.test(l.slice($.lastIndex)),m=$.lastIndex+ge.lastIndex,this.input.nativeElement.setSelectionRange(m,m)}else if(U===d)n==="insert"||n==="delete-back-single"?this.input.nativeElement.setSelectionRange(m+1,m+1):n==="delete-single"?this.input.nativeElement.setSelectionRange(m-1,m-1):(n==="delete-range"||n==="spin")&&this.input.nativeElement.setSelectionRange(m,m);else if(n==="delete-back-single"){let I=r.charAt(m-1),z=r.charAt(m),j=d-U,$=this._group.test(z);$&&j===1?m+=1:!$&&this.isNumeralChar(I)&&(m+=-1*j+1),this._group.lastIndex=0,this.input.nativeElement.setSelectionRange(m,m)}else if(r==="-"&&n==="insert"){this.input.nativeElement.setSelectionRange(0,0);let z=this.initCursor()+i.length+1;this.input.nativeElement.setSelectionRange(z,z)}else m=m+(U-d),this.input.nativeElement.setSelectionRange(m,m)}this.input.nativeElement.setAttribute("aria-valuenow",e)}concatValues(e,i){if(e&&i){let n=i.search(this._decimal);return this._decimal.lastIndex=0,this.suffixChar?n!==-1?e.replace(this.suffixChar,"").split(this._decimal)[0]+i.replace(this.suffixChar,"").slice(n)+this.suffixChar:e:n!==-1?e.split(this._decimal)[0]+i.slice(n):e}return e}getDecimalLength(e){if(e){let i=e.split(this._decimal);if(i.length===2)return i[1].replace(this._suffix,"").trim().replace(/\s/g,"").replace(this._currency,"").length}return 0}onInputFocus(e){this.focused=!0,this.onFocus.emit(e)}onInputBlur(e){this.focused=!1;let i=this.validateValue(this.parseValue(this.input.nativeElement.value)),n=i?.toString();this.input.nativeElement.value=this.formatValue(n),this.input.nativeElement.setAttribute("aria-valuenow",n),this.updateModel(e,i),this.onModelTouched(),this.onBlur.emit(e)}formattedValue(){let e=!this.value&&!this.allowEmpty?0:this.value;return this.formatValue(e)}updateModel(e,i){let n=this.ngControl?.control?.updateOn==="blur";this.value!==i?(this.value=i,n&&this.focused||this.onModelChange(i)):n&&this.onModelChange(i)}writeControlValue(e,i){this.value=e&&Number(e),i(e),this.cd.markForCheck()}clearTimer(){this.timer&&clearInterval(this.timer)}get dataP(){return this.cn({invalid:this.invalid(),disabled:this.$disabled(),focus:this.focused,fluid:this.hasFluid,filled:this.$variant()==="filled",empty:!this.$filled(),[this.size()]:this.size(),[this.buttonLayout]:this.showButtons&&this.buttonLayout})}static \u0275fac=function(i){return new(i||t)(xe(be))};static \u0275cmp=w({type:t,selectors:[["p-inputNumber"],["p-inputnumber"],["p-input-number"]],contentQueries:function(i,n,a){if(i&1&&ee(a,Tt,4)(a,vt,4)(a,Pt,4)(a,K,4),i&2){let r;D(r=L())&&(n.clearIconTemplate=r.first),D(r=L())&&(n.incrementButtonIconTemplate=r.first),D(r=L())&&(n.decrementButtonIconTemplate=r.first),D(r=L())&&(n.templates=r)}},viewQuery:function(i,n){if(i&1&&Ce(Bt,5),i&2){let a;D(a=L())&&(n.input=a.first)}},hostVars:3,hostBindings:function(i,n){i&2&&(P("data-p",n.dataP),g(n.cn(n.cx("root"),n.styleClass)))},inputs:{showButtons:[2,"showButtons","showButtons",v],format:[2,"format","format",v],buttonLayout:"buttonLayout",inputId:"inputId",styleClass:"styleClass",placeholder:"placeholder",tabindex:[2,"tabindex","tabindex",Q],title:"title",ariaLabelledBy:"ariaLabelledBy",ariaDescribedBy:"ariaDescribedBy",ariaLabel:"ariaLabel",ariaRequired:[2,"ariaRequired","ariaRequired",v],autocomplete:"autocomplete",incrementButtonClass:"incrementButtonClass",decrementButtonClass:"decrementButtonClass",incrementButtonIcon:"incrementButtonIcon",decrementButtonIcon:"decrementButtonIcon",readonly:[2,"readonly","readonly",v],allowEmpty:[2,"allowEmpty","allowEmpty",v],locale:"locale",localeMatcher:"localeMatcher",mode:"mode",currency:"currency",currencyDisplay:"currencyDisplay",useGrouping:[2,"useGrouping","useGrouping",v],minFractionDigits:[2,"minFractionDigits","minFractionDigits",e=>Q(e,void 0)],maxFractionDigits:[2,"maxFractionDigits","maxFractionDigits",e=>Q(e,void 0)],prefix:"prefix",suffix:"suffix",inputStyle:"inputStyle",inputStyleClass:"inputStyleClass",showClear:[2,"showClear","showClear",v],autofocus:[2,"autofocus","autofocus",v]},outputs:{onInput:"onInput",onFocus:"onFocus",onBlur:"onBlur",onKeyDown:"onKeyDown",onClear:"onClear"},features:[ne([rn,it,{provide:at,useExisting:t},{provide:pe,useExisting:t}]),Y([M]),T],decls:6,vars:38,consts:[["input",""],["pInputText","","role","spinbutton","inputmode","decimal",3,"input","keydown","keypress","paste","click","focus","blur","value","ngStyle","variant","invalid","pSize","pt","unstyled","pAutoFocus","fluid"],[4,"ngIf"],[3,"pBind","class",4,"ngIf"],["type","button","tabindex","-1",3,"pBind","class","mousedown","mouseup","mouseleave","keydown","keyup",4,"ngIf"],["data-p-icon","times",3,"pBind","class","click",4,"ngIf"],[3,"pBind","class","click",4,"ngIf"],["data-p-icon","times",3,"click","pBind"],[3,"click","pBind"],[4,"ngTemplateOutlet"],[3,"pBind"],["type","button","tabindex","-1",3,"mousedown","mouseup","mouseleave","keydown","keyup","pBind"],[3,"pBind","ngClass",4,"ngIf"],[3,"pBind","ngClass"],["data-p-icon","angle-up",3,"pBind",4,"ngIf"],["data-p-icon","angle-up",3,"pBind"],["data-p-icon","angle-down",3,"pBind",4,"ngIf"],["data-p-icon","angle-down",3,"pBind"]],template:function(i,n){i&1&&(b(0,"input",1,0),B("input",function(r){return n.onUserInput(r)})("keydown",function(r){return n.onInputKeyDown(r)})("keypress",function(r){return n.onInputKeyPress(r)})("paste",function(r){return n.onPaste(r)})("click",function(){return n.onInputClick()})("focus",function(r){return n.onInputFocus(r)})("blur",function(r){return n.onInputBlur(r)}),x(),c(2,Mt,3,2,"ng-container",2)(3,Ut,7,20,"span",3)(4,Jt,3,8,"button",4)(5,tn,3,8,"button",4)),i&2&&(g(n.cn(n.cx("pcInputText"),n.inputStyleClass)),o("value",n.formattedValue())("ngStyle",n.inputStyle)("variant",n.$variant())("invalid",n.invalid())("pSize",n.size())("pt",n.ptm("pcInputText"))("unstyled",n.unstyled())("pAutoFocus",n.autofocus)("fluid",n.hasFluid),P("id",n.inputId)("aria-valuemin",n.min())("aria-valuemax",n.max())("aria-valuenow",n.value)("placeholder",n.placeholder)("aria-label",n.ariaLabel)("aria-labelledby",n.ariaLabelledBy)("aria-describedby",n.ariaDescribedBy)("title",n.title)("size",n.inputSize())("name",n.name())("autocomplete",n.autocomplete)("maxlength",n.maxlength())("minlength",n.minlength())("tabindex",n.tabindex)("aria-required",n.ariaRequired)("min",n.min())("max",n.max())("step",n.step()??1)("required",n.required()?"":void 0)("readonly",n.readonly?"":void 0)("disabled",n.$disabled()?"":void 0)("data-p",n.dataP),u(2),o("ngIf",n.buttonLayout!="vertical"&&n.showClear&&n.value),u(),o("ngIf",n.showButtons&&n.buttonLayout==="stacked"),u(),o("ngIf",n.showButtons&&n.buttonLayout!=="stacked"),u(),o("ngIf",n.showButtons&&n.buttonLayout!=="stacked"))},dependencies:[oe,ue,ae,re,Le,$e,Oe,ze,tt,Xe,F,Ae,M],encapsulation:2,changeDetection:0})}return t})(),na=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=X({type:t});static \u0275inj=Z({imports:[de,F,F]})}return t})();var rt=`
    .p-paginator {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        background: dt('paginator.background');
        color: dt('paginator.color');
        padding: dt('paginator.padding');
        border-radius: dt('paginator.border.radius');
        gap: dt('paginator.gap');
    }

    .p-paginator-content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: dt('paginator.gap');
    }

    .p-paginator-content-start {
        margin-inline-end: auto;
    }

    .p-paginator-content-end {
        margin-inline-start: auto;
    }

    .p-paginator-page,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-first,
    .p-paginator-prev {
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        user-select: none;
        overflow: hidden;
        position: relative;
        background: dt('paginator.nav.button.background');
        border: 0 none;
        color: dt('paginator.nav.button.color');
        min-width: dt('paginator.nav.button.width');
        height: dt('paginator.nav.button.height');
        transition:
            background dt('paginator.transition.duration'),
            color dt('paginator.transition.duration'),
            outline-color dt('paginator.transition.duration'),
            box-shadow dt('paginator.transition.duration');
        border-radius: dt('paginator.nav.button.border.radius');
        padding: 0;
        margin: 0;
    }

    .p-paginator-page:focus-visible,
    .p-paginator-next:focus-visible,
    .p-paginator-last:focus-visible,
    .p-paginator-first:focus-visible,
    .p-paginator-prev:focus-visible {
        box-shadow: dt('paginator.nav.button.focus.ring.shadow');
        outline: dt('paginator.nav.button.focus.ring.width') dt('paginator.nav.button.focus.ring.style') dt('paginator.nav.button.focus.ring.color');
        outline-offset: dt('paginator.nav.button.focus.ring.offset');
    }

    .p-paginator-page:not(.p-disabled):not(.p-paginator-page-selected):hover,
    .p-paginator-first:not(.p-disabled):hover,
    .p-paginator-prev:not(.p-disabled):hover,
    .p-paginator-next:not(.p-disabled):hover,
    .p-paginator-last:not(.p-disabled):hover {
        background: dt('paginator.nav.button.hover.background');
        color: dt('paginator.nav.button.hover.color');
    }

    .p-paginator-page.p-paginator-page-selected {
        background: dt('paginator.nav.button.selected.background');
        color: dt('paginator.nav.button.selected.color');
    }

    .p-paginator-current {
        color: dt('paginator.current.page.report.color');
    }

    .p-paginator-pages {
        display: flex;
        align-items: center;
        gap: dt('paginator.gap');
    }

    .p-paginator-jtp-input .p-inputtext {
        max-width: dt('paginator.jump.to.page.input.max.width');
    }

    .p-paginator-first:dir(rtl),
    .p-paginator-prev:dir(rtl),
    .p-paginator-next:dir(rtl),
    .p-paginator-last:dir(rtl) {
        transform: rotate(180deg);
    }
`;var on=["dropdownicon"],sn=["firstpagelinkicon"],pn=["previouspagelinkicon"],ln=["lastpagelinkicon"],un=["nextpagelinkicon"],me=t=>({$implicit:t}),cn=t=>({pageLink:t});function dn(t,s){t&1&&H(0)}function mn(t,s){if(t&1&&(b(0,"div",10),c(1,dn,1,0,"ng-container",11),x()),t&2){let e=p();g(e.cx("contentStart")),o("pBind",e.ptm("contentStart")),u(),o("ngTemplateOutlet",e.templateLeft)("ngTemplateOutletContext",ie(5,me,e.paginatorState))}}function gn(t,s){if(t&1&&(b(0,"span",10),te(1),x()),t&2){let e=p();g(e.cx("current")),o("pBind",e.ptm("current")),u(),le(e.currentPageReport)}}function fn(t,s){if(t&1&&(y(),S(0,"svg",14)),t&2){let e=p(2);g(e.cx("firstIcon")),o("pBind",e.ptm("firstIcon"))}}function _n(t,s){}function hn(t,s){t&1&&c(0,_n,0,0,"ng-template")}function bn(t,s){if(t&1&&(b(0,"span"),c(1,hn,1,0,null,15),x()),t&2){let e=p(2);g(e.cx("firstIcon")),u(),o("ngTemplateOutlet",e.firstPageLinkIconTemplate||e._firstPageLinkIconTemplate)}}function xn(t,s){if(t&1){let e=E();b(0,"button",12),B("click",function(n){f(e);let a=p();return _(a.changePageToFirst(n))}),c(1,fn,1,3,"svg",13)(2,bn,2,3,"span",4),x()}if(t&2){let e=p();g(e.cx("first")),o("pBind",e.ptm("first")),P("aria-label",e.getAriaLabel("firstPageLabel")),u(),o("ngIf",!e.firstPageLinkIconTemplate&&!e._firstPageLinkIconTemplate),u(),o("ngIf",e.firstPageLinkIconTemplate||e._firstPageLinkIconTemplate)}}function yn(t,s){if(t&1&&(y(),S(0,"svg",16)),t&2){let e=p();g(e.cx("prevIcon")),o("pBind",e.ptm("prevIcon"))}}function In(t,s){}function Cn(t,s){t&1&&c(0,In,0,0,"ng-template")}function wn(t,s){if(t&1&&(b(0,"span"),c(1,Cn,1,0,null,15),x()),t&2){let e=p();g(e.cx("prevIcon")),u(),o("ngTemplateOutlet",e.previousPageLinkIconTemplate||e._previousPageLinkIconTemplate)}}function Tn(t,s){if(t&1){let e=E();b(0,"button",12),B("click",function(n){let a=f(e).$implicit,r=p(2);return _(r.onPageLinkClick(n,a-1))}),te(1),x()}if(t&2){let e=s.$implicit,i=p(2);g(i.cx("page",ie(6,cn,e))),o("pBind",i.ptm("page")),P("aria-label",i.getPageAriaLabel(e))("aria-current",e-1==i.getPage()?"page":void 0),u(),Te(" ",i.getLocalization(e)," ")}}function vn(t,s){if(t&1&&(b(0,"span",10),c(1,Tn,2,8,"button",17),x()),t&2){let e=p();g(e.cx("pages")),o("pBind",e.ptm("pages")),u(),o("ngForOf",e.pageLinks)}}function Pn(t,s){if(t&1&&te(0),t&2){let e=p(2);le(e.currentPageReport)}}function Bn(t,s){t&1&&H(0)}function kn(t,s){if(t&1&&c(0,Bn,1,0,"ng-container",11),t&2){let e=s.$implicit,i=p(3);o("ngTemplateOutlet",i.jumpToPageItemTemplate)("ngTemplateOutletContext",ie(2,me,e))}}function Sn(t,s){t&1&&(A(0),c(1,kn,1,4,"ng-template",21),O())}function Dn(t,s){t&1&&H(0)}function Ln(t,s){if(t&1&&c(0,Dn,1,0,"ng-container",15),t&2){let e=p(3);o("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Mn(t,s){t&1&&c(0,Ln,1,1,"ng-template",22)}function En(t,s){if(t&1){let e=E();b(0,"p-select",18),B("onChange",function(n){f(e);let a=p();return _(a.onPageDropdownChange(n))}),c(1,Pn,1,1,"ng-template",19)(2,Sn,2,0,"ng-container",20)(3,Mn,1,0,null,20),x()}if(t&2){let e=p();o("options",e.pageItems)("ngModel",e.getPage())("disabled",e.empty())("styleClass",e.cx("pcJumpToPageDropdown"))("appendTo",e.dropdownAppendTo||e.$appendTo())("scrollHeight",e.dropdownScrollHeight)("pt",e.ptm("pcJumpToPageDropdown"))("unstyled",e.unstyled()),P("aria-label",e.getAriaLabel("jumpToPageDropdownLabel")),u(2),o("ngIf",e.jumpToPageItemTemplate),u(),o("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Vn(t,s){if(t&1&&(y(),S(0,"svg",23)),t&2){let e=p();g(e.cx("nextIcon")),o("pBind",e.ptm("nextIcon"))}}function Nn(t,s){}function Fn(t,s){t&1&&c(0,Nn,0,0,"ng-template")}function Rn(t,s){if(t&1&&(b(0,"span"),c(1,Fn,1,0,null,15),x()),t&2){let e=p();g(e.cx("nextIcon")),u(),o("ngTemplateOutlet",e.nextPageLinkIconTemplate||e._nextPageLinkIconTemplate)}}function An(t,s){if(t&1&&(y(),S(0,"svg",25)),t&2){let e=p(2);g(e.cx("lastIcon")),o("pBind",e.ptm("lastIcon"))}}function On(t,s){}function jn(t,s){t&1&&c(0,On,0,0,"ng-template")}function zn(t,s){if(t&1&&(b(0,"span"),c(1,jn,1,0,null,15),x()),t&2){let e=p(2);g(e.cx("lastIcon")),u(),o("ngTemplateOutlet",e.lastPageLinkIconTemplate||e._lastPageLinkIconTemplate)}}function $n(t,s){if(t&1){let e=E();b(0,"button",2),B("click",function(n){f(e);let a=p();return _(a.changePageToLast(n))}),c(1,An,1,3,"svg",24)(2,zn,2,3,"span",4),x()}if(t&2){let e=p();g(e.cx("last")),o("pBind",e.ptm("last"))("disabled",e.isLastPage()||e.empty()),P("aria-label",e.getAriaLabel("lastPageLabel")),u(),o("ngIf",!e.lastPageLinkIconTemplate&&!e._lastPageLinkIconTemplate),u(),o("ngIf",e.lastPageLinkIconTemplate||e._lastPageLinkIconTemplate)}}function Un(t,s){if(t&1){let e=E();b(0,"p-inputnumber",26),B("ngModelChange",function(n){f(e);let a=p();return _(a.changePage(n-1))}),x()}if(t&2){let e=p();g(e.cx("pcJumpToPageInput")),o("pt",e.ptm("pcJumpToPageInput"))("ngModel",e.currentPage())("disabled",e.empty())("unstyled",e.unstyled())}}function Gn(t,s){t&1&&H(0)}function Qn(t,s){if(t&1&&c(0,Gn,1,0,"ng-container",11),t&2){let e=s.$implicit,i=p(3);o("ngTemplateOutlet",i.dropdownItemTemplate)("ngTemplateOutletContext",ie(2,me,e))}}function Kn(t,s){t&1&&(A(0),c(1,Qn,1,4,"ng-template",21),O())}function qn(t,s){t&1&&H(0)}function Hn(t,s){if(t&1&&c(0,qn,1,0,"ng-container",15),t&2){let e=p(3);o("ngTemplateOutlet",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Jn(t,s){t&1&&c(0,Hn,1,1,"ng-template",22)}function Zn(t,s){if(t&1){let e=E();b(0,"p-select",27),Be("ngModelChange",function(n){f(e);let a=p();return Pe(a.rows,n)||(a.rows=n),_(n)}),B("onChange",function(n){f(e);let a=p();return _(a.onRppChange(n))}),c(1,Kn,2,0,"ng-container",20)(2,Jn,1,0,null,20),x()}if(t&2){let e=p();o("options",e.rowsPerPageItems),ve("ngModel",e.rows),o("styleClass",e.cx("pcRowPerPageDropdown"))("disabled",e.empty())("appendTo",e.dropdownAppendTo||e.$appendTo())("scrollHeight",e.dropdownScrollHeight)("ariaLabel",e.getAriaLabel("rowsPerPageLabel"))("pt",e.ptm("pcRowPerPageDropdown"))("unstyled",e.unstyled()),u(),o("ngIf",e.dropdownItemTemplate),u(),o("ngIf",e.dropdownIconTemplate||e._dropdownIconTemplate)}}function Wn(t,s){t&1&&H(0)}function Xn(t,s){if(t&1&&(b(0,"div",10),c(1,Wn,1,0,"ng-container",11),x()),t&2){let e=p();g(e.cx("contentEnd")),o("pBind",e.ptm("contentEnd")),u(),o("ngTemplateOutlet",e.templateRight)("ngTemplateOutletContext",ie(5,me,e.paginatorState))}}var Yn={paginator:({instance:t})=>["p-paginator p-component"],content:"p-paginator-content",contentStart:"p-paginator-content-start",contentEnd:"p-paginator-content-end",first:({instance:t})=>["p-paginator-first",{"p-disabled":t.isFirstPage()||t.empty()}],firstIcon:"p-paginator-first-icon",prev:({instance:t})=>["p-paginator-prev",{"p-disabled":t.isFirstPage()||t.empty()}],prevIcon:"p-paginator-prev-icon",next:({instance:t})=>["p-paginator-next",{"p-disabled":t.isLastPage()||t.empty()}],nextIcon:"p-paginator-next-icon",last:({instance:t})=>["p-paginator-last",{"p-disabled":t.isLastPage()||t.empty()}],lastIcon:"p-paginator-last-icon",pages:"p-paginator-pages",page:({instance:t,pageLink:s})=>["p-paginator-page",{"p-paginator-page-selected":s-1==t.getPage()}],current:"p-paginator-current",pcRowPerPageDropdown:"p-paginator-rpp-dropdown",pcJumpToPageDropdown:"p-paginator-jtp-dropdown",pcJumpToPageInput:"p-paginator-jtp-input"},ot=(()=>{class t extends se{name="paginator";style=rt;classes=Yn;static \u0275fac=(()=>{let e;return function(n){return(e||(e=C(t)))(n||t)}})();static \u0275prov=J({token:t,factory:t.\u0275fac})}return t})();var st=new W("PAGINATOR_INSTANCE"),ei=(()=>{class t extends ce{componentName="Paginator";bindDirectiveInstance=V(M,{self:!0});$pcPaginator=V(st,{optional:!0,skipSelf:!0})??void 0;onAfterViewChecked(){this.bindDirectiveInstance.setAttrs(this.ptms(["host","root"]))}pageLinkSize=5;styleClass;alwaysShow=!0;dropdownAppendTo;templateLeft;templateRight;dropdownScrollHeight="200px";currentPageReportTemplate="{currentPage} of {totalPages}";showCurrentPageReport;showFirstLastIcon=!0;totalRecords=0;rows=0;rowsPerPageOptions;showJumpToPageDropdown;showJumpToPageInput;jumpToPageItemTemplate;showPageLinks=!0;locale;dropdownItemTemplate;get first(){return this._first}set first(e){this._first=e}appendTo=Se(void 0);onPageChange=new G;dropdownIconTemplate;firstPageLinkIconTemplate;previousPageLinkIconTemplate;lastPageLinkIconTemplate;nextPageLinkIconTemplate;templates;_dropdownIconTemplate;_firstPageLinkIconTemplate;_previousPageLinkIconTemplate;_lastPageLinkIconTemplate;_nextPageLinkIconTemplate;pageLinks;pageItems;rowsPerPageItems;paginatorState;_first=0;_page=0;_componentStyle=V(ot);$appendTo=ke(()=>this.appendTo()||this.config.overlayAppendTo());get display(){return this.alwaysShow||this.pageLinks&&this.pageLinks.length>1?null:"none"}constructor(){super()}onInit(){this.updatePaginatorState()}onAfterContentInit(){this.templates.forEach(e=>{switch(e.getType()){case"dropdownicon":this._dropdownIconTemplate=e.template;break;case"firstpagelinkicon":this._firstPageLinkIconTemplate=e.template;break;case"previouspagelinkicon":this._previousPageLinkIconTemplate=e.template;break;case"lastpagelinkicon":this._lastPageLinkIconTemplate=e.template;break;case"nextpagelinkicon":this._nextPageLinkIconTemplate=e.template;break}})}getAriaLabel(e){return this.config.translation.aria?this.config.translation.aria[e]:void 0}getPageAriaLabel(e){return this.config.translation.aria?this.config.translation.aria.pageLabel?.replace(/{page}/g,`${e}`):void 0}getLocalization(e){let i=[...new Intl.NumberFormat(this.locale,{useGrouping:!1}).format(9876543210)].reverse(),n=new Map(i.map((a,r)=>[r,a]));return e>9?String(e).split("").map(r=>n.get(Number(r))).join(""):n.get(e)}onChanges(e){e.totalRecords&&(this.updatePageLinks(),this.updatePaginatorState(),this.updateFirst(),this.updateRowsPerPageOptions()),e.first&&(this._first=e.first.currentValue,this.updatePageLinks(),this.updatePaginatorState()),e.rows&&(this.updatePageLinks(),this.updatePaginatorState()),e.rowsPerPageOptions&&this.updateRowsPerPageOptions(),e.pageLinkSize&&this.updatePageLinks()}updateRowsPerPageOptions(){if(this.rowsPerPageOptions){this.rowsPerPageItems=[];let e=null;for(let i of this.rowsPerPageOptions)typeof i=="object"&&i.showAll?e={label:i.showAll,value:this.totalRecords}:this.rowsPerPageItems.push({label:String(this.getLocalization(i)),value:i});e&&this.rowsPerPageItems.push(e)}}isFirstPage(){return this.getPage()===0}isLastPage(){return this.getPage()===this.getPageCount()-1}getPageCount(){return Math.ceil(this.totalRecords/this.rows)}calculatePageLinkBoundaries(){let e=this.getPageCount(),i=Math.min(this.pageLinkSize,e),n=Math.max(0,Math.ceil(this.getPage()-i/2)),a=Math.min(e-1,n+i-1);var r=this.pageLinkSize-(a-n+1);return n=Math.max(0,n-r),[n,a]}updatePageLinks(){this.pageLinks=[];let e=this.calculatePageLinkBoundaries(),i=e[0],n=e[1];for(let a=i;a<=n;a++)this.pageLinks.push(a+1);if(this.showJumpToPageDropdown){this.pageItems=[];for(let a=0;a<this.getPageCount();a++)this.pageItems.push({label:String(a+1),value:a})}}changePage(e){var i=this.getPageCount();if(e>=0&&e<i){this._first=this.rows*e;var n={page:e,first:this.first,rows:this.rows,pageCount:i};this.updatePageLinks(),this.onPageChange.emit(n),this.updatePaginatorState()}}updateFirst(){let e=this.getPage();e>0&&this.totalRecords&&this.first>=this.totalRecords&&Promise.resolve(null).then(()=>this.changePage(e-1))}getPage(){return Math.floor(this.first/this.rows)}changePageToFirst(e){this.isFirstPage()||this.changePage(0),e.preventDefault()}changePageToPrev(e){this.changePage(this.getPage()-1),e.preventDefault()}changePageToNext(e){this.changePage(this.getPage()+1),e.preventDefault()}changePageToLast(e){this.isLastPage()||this.changePage(this.getPageCount()-1),e.preventDefault()}onPageLinkClick(e,i){this.changePage(i),e.preventDefault()}onRppChange(e){this.changePage(this.getPage())}onPageDropdownChange(e){this.changePage(e.value)}updatePaginatorState(){this.paginatorState={page:this.getPage(),pageCount:this.getPageCount(),rows:this.rows,first:this.first,totalRecords:this.totalRecords}}empty(){return this.getPageCount()===0}currentPage(){return this.getPageCount()>0?this.getPage()+1:0}get currentPageReport(){return this.currentPageReportTemplate.replace("{currentPage}",String(this.currentPage())).replace("{totalPages}",String(this.getPageCount())).replace("{first}",String(this.totalRecords>0?this._first+1:0)).replace("{last}",String(Math.min(this._first+this.rows,this.totalRecords))).replace("{rows}",String(this.rows)).replace("{totalRecords}",String(this.totalRecords))}static \u0275fac=function(i){return new(i||t)};static \u0275cmp=w({type:t,selectors:[["p-paginator"]],contentQueries:function(i,n,a){if(i&1&&ee(a,on,4)(a,sn,4)(a,pn,4)(a,ln,4)(a,un,4)(a,K,4),i&2){let r;D(r=L())&&(n.dropdownIconTemplate=r.first),D(r=L())&&(n.firstPageLinkIconTemplate=r.first),D(r=L())&&(n.previousPageLinkIconTemplate=r.first),D(r=L())&&(n.lastPageLinkIconTemplate=r.first),D(r=L())&&(n.nextPageLinkIconTemplate=r.first),D(r=L())&&(n.templates=r)}},hostVars:4,hostBindings:function(i,n){i&2&&(g(n.cn(n.cx("paginator"),n.styleClass)),we("display",n.display))},inputs:{pageLinkSize:[2,"pageLinkSize","pageLinkSize",Q],styleClass:"styleClass",alwaysShow:[2,"alwaysShow","alwaysShow",v],dropdownAppendTo:"dropdownAppendTo",templateLeft:"templateLeft",templateRight:"templateRight",dropdownScrollHeight:"dropdownScrollHeight",currentPageReportTemplate:"currentPageReportTemplate",showCurrentPageReport:[2,"showCurrentPageReport","showCurrentPageReport",v],showFirstLastIcon:[2,"showFirstLastIcon","showFirstLastIcon",v],totalRecords:[2,"totalRecords","totalRecords",Q],rows:[2,"rows","rows",Q],rowsPerPageOptions:"rowsPerPageOptions",showJumpToPageDropdown:[2,"showJumpToPageDropdown","showJumpToPageDropdown",v],showJumpToPageInput:[2,"showJumpToPageInput","showJumpToPageInput",v],jumpToPageItemTemplate:"jumpToPageItemTemplate",showPageLinks:[2,"showPageLinks","showPageLinks",v],locale:"locale",dropdownItemTemplate:"dropdownItemTemplate",first:"first",appendTo:[1,"appendTo"]},outputs:{onPageChange:"onPageChange"},features:[ne([ot,{provide:st,useExisting:t},{provide:pe,useExisting:t}]),Y([M]),T],decls:15,vars:23,consts:[[3,"pBind","class",4,"ngIf"],["type","button","pRipple","",3,"pBind","class","click",4,"ngIf"],["type","button","pRipple","",3,"click","pBind","disabled"],["data-p-icon","angle-left",3,"pBind","class",4,"ngIf"],[3,"class",4,"ngIf"],[3,"options","ngModel","disabled","styleClass","appendTo","scrollHeight","pt","unstyled","onChange",4,"ngIf"],["data-p-icon","angle-right",3,"pBind","class",4,"ngIf"],["type","button","pRipple","",3,"pBind","disabled","class","click",4,"ngIf"],[3,"pt","ngModel","class","disabled","unstyled","ngModelChange",4,"ngIf"],[3,"options","ngModel","styleClass","disabled","appendTo","scrollHeight","ariaLabel","pt","unstyled","ngModelChange","onChange",4,"ngIf"],[3,"pBind"],[4,"ngTemplateOutlet","ngTemplateOutletContext"],["type","button","pRipple","",3,"click","pBind"],["data-p-icon","angle-double-left",3,"pBind","class",4,"ngIf"],["data-p-icon","angle-double-left",3,"pBind"],[4,"ngTemplateOutlet"],["data-p-icon","angle-left",3,"pBind"],["type","button","pRipple","",3,"pBind","class","click",4,"ngFor","ngForOf"],[3,"onChange","options","ngModel","disabled","styleClass","appendTo","scrollHeight","pt","unstyled"],["pTemplate","selectedItem"],[4,"ngIf"],["pTemplate","item"],["pTemplate","dropdownicon"],["data-p-icon","angle-right",3,"pBind"],["data-p-icon","angle-double-right",3,"pBind","class",4,"ngIf"],["data-p-icon","angle-double-right",3,"pBind"],[3,"ngModelChange","pt","ngModel","disabled","unstyled"],[3,"ngModelChange","onChange","options","ngModel","styleClass","disabled","appendTo","scrollHeight","ariaLabel","pt","unstyled"]],template:function(i,n){i&1&&(c(0,mn,2,7,"div",0)(1,gn,2,4,"span",0)(2,xn,3,6,"button",1),b(3,"button",2),B("click",function(r){return n.changePageToPrev(r)}),c(4,yn,1,3,"svg",3)(5,wn,2,3,"span",4),x(),c(6,vn,2,4,"span",0)(7,En,4,11,"p-select",5),b(8,"button",2),B("click",function(r){return n.changePageToNext(r)}),c(9,Vn,1,3,"svg",6)(10,Rn,2,3,"span",4),x(),c(11,$n,3,7,"button",7)(12,Un,1,6,"p-inputnumber",8)(13,Zn,3,11,"p-select",9)(14,Xn,2,7,"div",0)),i&2&&(o("ngIf",n.templateLeft),u(),o("ngIf",n.showCurrentPageReport),u(),o("ngIf",n.showFirstLastIcon),u(),g(n.cx("prev")),o("pBind",n.ptm("prev"))("disabled",n.isFirstPage()||n.empty()),P("aria-label",n.getAriaLabel("prevPageLabel")),u(),o("ngIf",!n.previousPageLinkIconTemplate&&!n._previousPageLinkIconTemplate),u(),o("ngIf",n.previousPageLinkIconTemplate||n._previousPageLinkIconTemplate),u(),o("ngIf",n.showPageLinks),u(),o("ngIf",n.showJumpToPageDropdown),u(),g(n.cx("next")),o("pBind",n.ptm("next"))("disabled",n.isLastPage()||n.empty()),P("aria-label",n.getAriaLabel("nextPageLabel")),u(),o("ngIf",!n.nextPageLinkIconTemplate&&!n._nextPageLinkIconTemplate),u(),o("ngIf",n.nextPageLinkIconTemplate||n._nextPageLinkIconTemplate),u(),o("ngIf",n.showFirstLastIcon),u(),o("ngIf",n.showJumpToPageInput),u(),o("ngIf",n.rowsPerPageOptions),u(),o("ngIf",n.templateRight))},dependencies:[oe,De,ae,re,Ge,de,Fe,Ve,Ne,Ue,Ze,We,Ye,et,F,K,M],encapsulation:2,changeDetection:0})}return t})(),La=(()=>{class t{static \u0275fac=function(i){return new(i||t)};static \u0275mod=X({type:t});static \u0275inj=Z({imports:[ei,F,F]})}return t})();export{na as a,ei as b,La as c,ht as d,hi as e};
