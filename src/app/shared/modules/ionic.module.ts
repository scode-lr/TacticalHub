import { NgModule } from '@angular/core';
import {
  // Layout Components
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  
  // Card Components
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  
  // Form Components
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonToggle,
  
  // Navigation Components
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonTab,
  
  // List Components
  IonList,
  IonListHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  
  // Media Components
  IonIcon,
  IonImg,
  IonThumbnail,
  IonAvatar,
  
  // Feedback Components
  IonSpinner,
  IonProgressBar,
  IonToast,
  IonAlert,
  IonLoading,
  IonActionSheet,
  IonModal,
  IonPopover,
  
  // Text Components
  IonText,
  IonNote,
  IonBadge,
  IonChip,
  
  // Grid Components
  IonGrid,
  IonRow,
  IonCol,
  
  // Menu Components
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonSplitPane,
  
  // Search Components
  IonSearchbar,
  
  // Date/Time Components
  IonDatetime,
  IonDatetimeButton,
  
  // Segment Components
  IonSegment,
  IonSegmentButton,
  
  // Accordion Components
  IonAccordion,
  IonAccordionGroup,
  
  // Breadcrumb Components
  IonBreadcrumb,
  IonBreadcrumbs,
  
  // FAB Components
  IonFab,
  IonFabButton,
  IonFabList,
  
  // Infinite Scroll Components
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  
  // Refresher Components
  IonRefresher,
  IonRefresherContent,
  
  // Reorder Components
  IonReorder,
  IonReorderGroup,
  
  // Range Components
  IonRange,
  
  // Picker Components
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
} from '@ionic/angular/standalone';

const IONIC_COMPONENTS = [
  // Layout Components
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  
  // Card Components
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  
  // Form Components
  IonItem,
  IonLabel,
  IonInput,
  IonTextarea,
  IonButton,
  IonCheckbox,
  IonRadio,
  IonRadioGroup,
  IonSelect,
  IonSelectOption,
  IonToggle,
  
  // Navigation Components
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonTab,
  
  // List Components
  IonList,
  IonListHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  
  // Media Components
  IonIcon,
  IonImg,
  IonThumbnail,
  IonAvatar,
  
  // Feedback Components
  IonSpinner,
  IonProgressBar,
  IonToast,
  IonAlert,
  IonLoading,
  IonActionSheet,
  IonModal,
  IonPopover,
  
  // Text Components
  IonText,
  IonNote,
  IonBadge,
  IonChip,
  
  // Grid Components
  IonGrid,
  IonRow,
  IonCol,
  
  // Menu Components
  IonMenu,
  IonMenuButton,
  IonMenuToggle,
  IonSplitPane,
  
  // Search Components
  IonSearchbar,
  
  // Date/Time Components
  IonDatetime,
  IonDatetimeButton,
  
  // Segment Components
  IonSegment,
  IonSegmentButton,
  
  // Accordion Components
  IonAccordion,
  IonAccordionGroup,
  
  // Breadcrumb Components
  IonBreadcrumb,
  IonBreadcrumbs,
  
  // FAB Components
  IonFab,
  IonFabButton,
  IonFabList,
  
  // Infinite Scroll Components
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  
  // Refresher Components
  IonRefresher,
  IonRefresherContent,
  
  // Reorder Components
  IonReorder,
  IonReorderGroup,
  
  // Range Components
  IonRange,
  
  // Picker Components
  IonPicker,
  IonPickerColumn,
  IonPickerColumnOption,
];

@NgModule({
  imports: IONIC_COMPONENTS,
  exports: IONIC_COMPONENTS,
})
export class TacticalIonicModule {}