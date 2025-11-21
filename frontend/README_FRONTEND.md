# TinyLink Frontend

## Setup & Run

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Setup**:
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_BASE_URL=http://localhost:8000
    ```
    *(Replace `http://localhost:8000` with your actual backend URL)*

3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Testing Checklist

### Unit / Component Tests
- [ ] **LinkForm**:
    - [ ] Validates URL format (shows error if invalid).
    - [ ] Validates Custom Code regex `/^[A-Za-z0-9]{6,8}$/`.
    - [ ] Disables submit button while loading.
    - [ ] Displays API errors (409 Conflict, 400 Bad Request) correctly.
- [ ] **CopyButton**:
    - [ ] Copies text to clipboard.
    - [ ] Changes label to "Copied!" temporarily.
- [ ] **LinkTable**:
    - [ ] Renders list of links.
    - [ ] Filters links by code or target URL (client-side search).
    - [ ] Paginates correctly (20 items per page).
    - [ ] Shows empty state when no links exist.

### Integration / Manual Verification
- [ ] **Create Link**:
    - [ ] Create a link with just a target URL -> Verify success toast and new row in table.
    - [ ] Create a link with target + custom code -> Verify success.
    - [ ] Try to create a duplicate code -> Verify "Code already exists" error.
- [ ] **Delete Link**:
    - [ ] Click delete icon -> Verify modal opens.
    - [ ] Cancel modal -> Verify row remains.
    - [ ] Confirm delete -> Verify API call, success toast, and row removal.
- [ ] **Responsiveness**:
    - [ ] Check layout on Mobile (stacked form, scrollable table).
    - [ ] Check layout on Desktop.
- [ ] **Accessibility**:
    - [ ] Navigate entire flow using Keyboard (Tab/Enter/Space).
    - [ ] Verify screen reader announcements for Toast and Form Errors.
