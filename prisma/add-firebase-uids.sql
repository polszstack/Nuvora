-- One-time additive update for databases created before Firebase Authentication.
-- Existing accounts keep NULL until their first successful legacy sign-in.
ALTER TABLE `customer`
  ADD COLUMN `firebaseUid` VARCHAR(191) NULL,
  ADD UNIQUE INDEX `customer_firebaseUid_key` (`firebaseUid`);

ALTER TABLE `seller`
  ADD COLUMN `firebaseUid` VARCHAR(191) NULL,
  ADD UNIQUE INDEX `seller_firebaseUid_key` (`firebaseUid`);
