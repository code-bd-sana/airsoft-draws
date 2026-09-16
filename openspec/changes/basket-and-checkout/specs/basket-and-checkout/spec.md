## Purpose

Provides a persistent shopping basket and dedicated checkout workflow for airsoft competition tickets, enabling users to bundle entries across multiple raffles, verify age and UKARA legal defence eligibility, capture prize delivery details with profile auto-fill, and execute atomic multi-raffle ticket purchases.

## ADDED Requirements

### Requirement: Persistent Client Basket Storage
The system SHALL maintain a client-side shopping basket persisted in browser `localStorage` across page navigations and browser sessions.

#### Scenario: Adding items to local storage
- **WHEN** a user adds tickets for a competition to their basket
- **THEN** the item details (raffle ID, title, slug, thumbnail, unit price, quantity, total tickets, sold tickets, and prize classification) are serialized and persisted in browser `localStorage`

#### Scenario: Persisting basket across browser reload
- **WHEN** a user refreshes the page or navigates away and returns
- **THEN** the previously added basket items and quantities are hydrated from `localStorage` without data loss

---

### Requirement: Global Navigation Basket Indicator
The system SHALL display an interactive basket icon in the global website navigation with a dynamic item counter.

#### Scenario: Displaying item count badge
- **WHEN** there are one or more ticket items in the basket
- **THEN** the navbar basket icon displays a numeric badge reflecting the total number of ticket entries

#### Scenario: Navigating to basket page
- **WHEN** a user clicks the basket icon in the desktop navbar or mobile drawer
- **THEN** the browser navigates to `/basket`

---

### Requirement: Adding Competition Tickets from Raffle Page
The system SHALL provide an "Add to Basket" action on the competition details page that respects available ticket stock while retaining direct entry.

#### Scenario: Adding valid quantity
- **WHEN** a user selects a quantity within available remaining tickets and clicks "Add to Basket"
- **THEN** the basket updates with the selected tickets, a confirmation toast notification is displayed, and the navbar counter increments

#### Scenario: Exceeding remaining tickets
- **WHEN** a user attempts to add a quantity that exceeds the remaining tickets for that competition
- **THEN** the action is blocked and an error message informs the user of the maximum available tickets

---

### Requirement: Dedicated Basket Review Page (/basket)
The system SHALL render an itemized list of all selected raffle tickets on `/basket` with real-time controls and checkout transition.

#### Scenario: Adjusting ticket quantity
- **WHEN** a user increments or decrements the quantity of a basket item
- **THEN** the item line subtotal and overall basket total are recalculated immediately in real time

#### Scenario: Removing an item
- **WHEN** a user clicks the remove button for a basket item
- **THEN** that item is purged from the basket and the overall total updates accordingly

#### Scenario: Proceeding to checkout
- **WHEN** a user with at least one item in their basket clicks "Proceed to Checkout"
- **THEN** the browser navigates to the dedicated `/checkout` page

#### Scenario: Empty basket state
- **WHEN** there are no items in the basket
- **THEN** the `/basket` page displays an empty state banner with a call-to-action button linking to `/live-raffles`

---

### Requirement: Dedicated Checkout Page (/checkout) and Profile Pre-fill
The system SHALL provide a dedicated `/checkout` page that pre-fills known user information and prompts unauthenticated visitors.

#### Scenario: Pre-filling user details
- **WHEN** an authenticated user visits `/checkout`
- **THEN** First Name, Last Name, Email, Phone Number, Date of Birth, and Shipping Address are automatically pre-filled from their profile

#### Scenario: Unauthenticated visitor handling
- **WHEN** an unauthenticated visitor navigates to `/checkout`
- **THEN** an inline authentication/registration prompt is displayed, preserving cart items in `localStorage` until authenticated

---

### Requirement: Contact Information and 18+ Age Validation
The system SHALL collect mandatory contact information and verify legal age (18+) prior to payment.

#### Scenario: Underage participant blocked
- **WHEN** a user inputs a Date of Birth corresponding to an age under 18 years
- **THEN** checkout submission is blocked and a warning explains that participants must be 18 or older under UK law (VCRA 2006)

#### Scenario: Missing contact details
- **WHEN** a user submits the checkout form with empty First Name, Last Name, Email, or Phone
- **THEN** submission is prevented and field-level validation indicators are displayed

---

### Requirement: Prize Shipping Address Collection
The system SHALL collect a verified shipping address for potential prize fulfillment before payment.

#### Scenario: Capturing complete shipping address
- **WHEN** a user completes the Prize Shipping Address section
- **THEN** Address Line 1, Town / City, Postal Code, and Country are required, and Address Line 2 is optional

---

### Requirement: Statutory Compliance and Terms Acceptance
The system SHALL enforce statutory legal defence checks for Realistic Imitation Firearms (RIF) and Terms acceptance.

#### Scenario: Mandatory UKARA for RIF items
- **WHEN** the basket contains one or more items classified as RIF
- **THEN** a valid UKARA registration number is required to proceed with checkout

#### Scenario: UKARA optional for accessory-only basket
- **WHEN** all items in the basket are non-RIF accessories or two-tone items
- **THEN** UKARA registration is flagged as not required and checkout can proceed without it

#### Scenario: Mandatory Terms acceptance
- **WHEN** a user attempts to pay without checking the Terms & Conditions (v1.0) acceptance checkbox
- **THEN** checkout submission is prevented until the checkbox is checked

---

### Requirement: Multi-Raffle Atomic Ticket Purchase
The system SHALL atomically process payment and allocate ticket numbers across all basket items via `POST /api/v1/tickets/checkout`.

#### Scenario: Successful simulated basket checkout
- **WHEN** an authenticated eligible user confirms checkout under simulated payment mode
- **THEN** the backend atomically allocates random ticket numbers for each raffle, updates tickets sold, checks instant wins, records a master transaction, credits host wallets, clears the client basket, and displays all allocated ticket numbers

#### Scenario: Gateway redirect under live payment mode
- **WHEN** basket checkout is initiated with Cashflows gateway enabled (`USE_TEST_PAYMENT=false`)
- **THEN** the backend generates a consolidated Cashflows payment job with identifier `BSK_<transactionId>_<timestamp>` for the combined basket total and returns the hosted payment page URL

---

### Requirement: Automatic User Profile Synchronization
The system SHALL automatically save updated contact details and shipping address to the user's persistent profile upon checkout.

#### Scenario: Updating profile on checkout completion
- **WHEN** checkout is successfully processed
- **THEN** the user's First Name, Last Name, Phone, Date of Birth, UKARA Number, and formatted Shipping Address are saved to their user profile record in the database
