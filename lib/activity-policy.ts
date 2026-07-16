export type PrimitiveActivityValue =
  | string
  | number
  | boolean
  | null;

export type ActivitySnapshot = Record<
  string,
  PrimitiveActivityValue
>;

export type ChangedActivityFields = {
  changedFields: string[];
  before: ActivitySnapshot;
  after: ActivitySnapshot;
};

export function getChangedActivityFields<
  Snapshot extends ActivitySnapshot,
>(
  before: Snapshot,
  after: Snapshot
): ChangedActivityFields {
  const changedFields = Object.keys(after).filter(
    (field) => before[field] !== after[field]
  );

  return {
    changedFields,
    before: Object.fromEntries(
      changedFields.map((field) => [
        field,
        before[field],
      ])
    ),
    after: Object.fromEntries(
      changedFields.map((field) => [
        field,
        after[field],
      ])
    ),
  };
}

export function hasMeaningfulChanges(
  changes: ChangedActivityFields
) {
  return changes.changedFields.length > 0;
}
