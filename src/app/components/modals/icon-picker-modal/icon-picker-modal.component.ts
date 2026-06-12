import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonModal, IonIcon, IonSearchbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline, searchOutline } from 'ionicons/icons';

interface IconCategory {
  name: string;
  icons: string[];
}

@Component({
  selector: 'app-icon-picker-modal',
  templateUrl: './icon-picker-modal.component.html',
  styleUrls: ['./icon-picker-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonModal,
    IonIcon,
    IonSearchbar
  ]
})
export class IconPickerModalComponent {
  readonly isOpen = input.required<boolean>();
  readonly selectedIcon = input<string>('');

  readonly didDismiss = output<void>();
  readonly iconSelected = output<string>();

  readonly searchQuery = signal('');

  readonly categories: IconCategory[] = [
    {
      name: 'General',
      icons: [
        'add-outline', 'remove-outline', 'close-outline', 'checkmark-outline',
        'chevron-forward-outline', 'chevron-back-outline', 'chevron-up-outline',
        'chevron-down-outline', 'arrow-forward-outline', 'arrow-back-outline',
        'arrow-up-outline', 'arrow-down-outline', 'refresh-outline', 'sync-outline',
        'search-outline', 'menu-outline', 'more-horizontal-outline', 'more-vertical-outline',
        'ellipsis-horizontal-outline', 'ellipsis-vertical-outline', 'grid-outline',
        'list-outline', 'reorder-three-outline', 'reorder-four-outline'
      ]
    },
    {
      name: 'People',
      icons: [
        'person-outline', 'person-add-outline', 'person-remove-outline',
        'people-outline', 'people-circle-outline', 'person-circle-outline',
        'man-outline', 'woman-outline', 'accessibility-outline', 'account-circle-outline',
        'badge-outline', 'id-card-outline', 'finger-print-outline', 'shield-outline'
      ]
    },
    {
      name: 'Communication',
      icons: [
        'mail-outline', 'mail-open-outline', 'chatbox-outline', 'chatbubble-outline',
        'chatbox-ellipses-outline', 'chatbubbles-outline', 'call-outline', 'call-missed-outline',
        'notifications-outline', 'notifications-circle-outline', 'notifications-off-outline',
        'megaphone-outline', 'airplane-outline', 'wifi-outline', 'bluetooth-outline',
        'radio-outline', 'speedometer-outline'
      ]
    },
    {
      name: 'Actions',
      icons: [
        'create-outline', 'build-outline', 'construct-outline', 'hammer-outline',
        'cog-outline', 'settings-outline', 'options-outline', 'toggle-outline',
        'radio-button-on-outline', 'checkbox-outline', 'square-outline', 'radio-outline',
        'play-outline', 'pause-outline', 'stop-outline', 'play-circle-outline',
        'skip-forward-outline', 'skip-backward-outline', 'arrow-redo-outline',
        'arrow-undo-outline', 'cloud-download-outline', 'cloud-upload-outline',
        'download-outline', 'upload-outline', 'share-outline', 'share-social-outline',
        'attach-outline', 'link-outline', 'unlink-outline', 'cut-outline',
        'copy-outline', 'clipboard-outline', 'paste-outline', 'trash-outline',
        'warning-outline', 'alert-outline', 'information-circle-outline', 'help-circle-outline',
        'help-buoy-outline', 'journal-outline', 'document-outline', 'document-text-outline',
        'folder-outline', 'folder-open-outline', 'archive-outline'
      ]
    },
    {
      name: 'Sports',
      icons: [
        'football-outline', 'basketball-outline', 'baseball-outline', 'tennisball-outline',
        'volleyball-outline', 'rugby-outline', 'handball-outline', 'golf-outline',
        'fitness-outline', 'walk-outline', 'run-outline', 'bicycle-outline',
        'medal-outline', 'trophy-outline', 'ribbon-outline', 'flag-outline',
        'pin-outline', 'gps-outline', 'compass-outline', 'navigate-outline'
      ]
    },
    {
      name: 'Media',
      icons: [
        'camera-outline', 'camera-reverse-outline', 'videocam-outline',
        'image-outline', 'images-outline', 'film-outline', 'musical-notes-outline',
        'headset-outline', 'mic-outline', 'mic-circle-outline', 'volume-high-outline',
        'volume-medium-outline', 'volume-low-outline', 'volume-mute-outline',
        'volume-off-outline', 'pause-circle-outline', 'stop-circle-outline',
        'play-skip-forward-outline', 'play-skip-back-outline', 'shuffle-outline',
        'repeat-outline', 'repeat-outline'
      ]
    },
    {
      name: 'Commerce',
      icons: [
        'card-outline', 'card-sharp', 'cash-outline', 'wallet-outline',
        'pricetag-outline', 'barcode-outline', 'barcode-sharp', 'cart-outline',
        'cart-sharp', 'basket-outline', 'bag-handle-outline', 'receipt-outline',
        'calculator-outline', 'percentage-outline'
      ]
    },
    {
      name: 'Time',
      icons: [
        'time-outline', 'timer-outline', 'stopwatch-outline', 'hourglass-outline',
        'calendar-outline', 'calendar-clear-outline', 'calendar-number-outline',
        'today-outline', 'alarm-outline', 'moon-outline', 'sunny-outline',
        'partly-sunny-outline', 'cloud-outline', 'cloudy-outline', 'rainy-outline',
        'thunderstorm-outline', 'snow-outline'
      ]
    },
    {
      name: 'Health',
      icons: [
        'medical-outline', 'medkit-outline', 'fitness-outline', 'heart-outline',
        'heart-dislike-outline', 'pulse-outline', 'bandage-outline', 'pill-outline',
        'thermometer-outline', 'eye-outline', 'ear-outline', 'nose-outline',
        'skull-outline', 'water-outline', 'nutrition-outline', 'cafe-outline'
      ]
    },
    {
      name: 'Places',
      icons: [
        'location-outline', 'location-sharp', 'map-outline', 'navigate-outline',
        'pin-outline', 'push-outline', 'home-outline', 'business-outline',
        'storefront-outline', 'school-outline', 'library-outline', 'church-outline',
        'fitness-center-outline', 'football-outline', 'water-outline', 'beach-outline',
        'planet-outline', 'globe-outline', 'globe-europe-outline', 'globe-america-outline'
      ]
    },
    {
      name: 'Shapes',
      icons: [
        'square-outline', 'square', 'rectangle-outline', 'circle-outline',
        'triangle-outline', 'star-outline', 'star-half-outline', 'star-outline',
        'heart-outline', 'heart-dislike-outline', 'flower-outline', 'leaf-outline',
        'paw-outline', 'tennisball-outline', 'basketball-outline', 'rugby-outline'
      ]
    },
    {
      name: 'Tech',
      icons: [
        'phone-portrait-outline', 'phone-landscape-outline', 'tablet-landscape-outline',
        'laptop-outline', 'desktop-outline', 'tv-outline', 'watch-outline',
        'game-controller-outline', 'bug-outline', 'code-outline', 'code-slash-outline',
        'terminal-outline', 'server-outline', 'cloud-outline', 'cloud-done-outline',
        'cloud-offline-outline', 'analytics-outline', 'bar-chart-outline',
        'pie-chart-outline', 'stats-chart-outline'
      ]
    }
  ];

  readonly filteredCategories = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.categories;

    return this.categories
      .map(cat => ({
        ...cat,
        icons: cat.icons.filter(icon => icon.toLowerCase().includes(query))
      }))
      .filter(cat => cat.icons.length > 0);
  });

  constructor() {
    addIcons({ closeOutline, searchOutline });
  }

  closeModal(): void {
    this.didDismiss.emit();
  }

  selectIcon(icon: string): void {
    this.iconSelected.emit(icon);
    this.didDismiss.emit();
  }

  clearSelection(): void {
    this.iconSelected.emit('');
    this.didDismiss.emit();
  }

  onSearchChange(event: CustomEvent): void {
    this.searchQuery.set(event.detail.value ?? '');
  }
}
