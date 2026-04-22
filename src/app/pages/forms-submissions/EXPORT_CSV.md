# Implementación: Exportar submissions a CSV

## Contexto

El endpoint `GET /forms/{formId}/submissions/export` devuelve un archivo `text/csv` con las submissions de un formulario. El botón de exportación ya existe en la barra de selección de `forms-submissions.page.html` (línea 19) y se muestra cuando hay formularios seleccionados en la vista de lista. Al hacer clic debe descargarse un `.csv` por cada formulario seleccionado.

---

## Archivos a modificar

| Archivo | Cambio |
|---------|--------|
| `src/app/core/services/api.service.ts` | Añadir método `getBlob()` |
| `src/app/core/services/form-submissions.service.ts` | Añadir método `exportSubmissions()` |
| `src/app/pages/forms-submissions/forms-submissions.page.ts` | Añadir método `exportSubmissions()` |
| `src/app/pages/forms-submissions/forms-submissions.page.html` | Conectar `(click)` del botón existente |

---

## Paso 1 — `api.service.ts`: añadir `getBlob()`

El método `get()` existente no reenvía `responseType` a `HttpClient`, por lo que no puede devolver un `Blob`. Añadir un método dedicado al final de la clase, antes del cierre `}`:

```typescript
getBlob(endpoint: string, options?: ApiRequestOptions): Observable<Blob> {
  const url = this.buildUrl(endpoint);
  const headers = this.buildHeaders(options);

  return this.http.get(url, {
    headers,
    params: options?.params,
    responseType: 'blob',
    context: options?.skipAuth ? skipAuthContext() : undefined
  }).pipe(
    timeout(options?.timeout || this.defaultTimeout),
    catchError(this.handleError)
  );
}
```

---

## Paso 2 — `form-submissions.service.ts`: añadir `exportSubmissions()`

Añadir al final de la clase `FormSubmissionsService`, antes del cierre `}`:

```typescript
async exportSubmissions(formId: number, formName: string): Promise<void> {
  const blob = await firstValueFrom(
    this.apiService.getBlob(`/forms/${formId}/submissions/export`)
  );
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${formName}_submissions.csv`;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
```

> El nombre del archivo usa `formName` para que el admin identifique el CSV descargado.

---

## Paso 3 — `forms-submissions.page.ts`: añadir `exportSubmissions()`

Añadir el método al componente, junto a los demás handlers de usuario:

```typescript
async exportSubmissions(): Promise<void> {
  for (const form of this.selectedForms) {
    await this.formSubmissionsService.exportSubmissions(form.id, form.name);
  }
}
```

> Si hay varios formularios seleccionados, el navegador descargará un CSV por cada uno secuencialmente.

---

## Paso 4 — `forms-submissions.page.html`: conectar el `(click)`

El botón en la línea 22 actualmente no tiene handler. Añadir `(click)`:

**Antes:**
```html
<button class="btn-action">
  <ion-icon name="download-outline"></ion-icon>
  {{ 'admin.forms.export' | translate }}
</button>
```

**Después:**
```html
<button class="btn-action" (click)="exportSubmissions()">
  <ion-icon name="download-outline"></ion-icon>
  {{ 'admin.forms.export' | translate }}
</button>
```

---

## Verificación

1. Ir a la sección de formularios como Admin.
2. Seleccionar uno o más formularios con el checkbox.
3. Hacer clic en "Exportar" → debe descargarse un `.csv` por cada formulario con el nombre `{formName}_submissions.csv`.
4. Abrir el CSV: primera columna `SubmittedAt`, columnas siguientes con los `Label` de los campos del formulario.
5. Probar con un formulario sin submissions → el CSV debe descargarse vacío (solo cabeceras).
