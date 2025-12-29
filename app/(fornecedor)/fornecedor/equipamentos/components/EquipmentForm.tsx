'use client';

// TODO: Implement EquipmentForm component

type EquipmentFormProps = {
  equipment?: unknown;
};

export const EquipmentForm = ({ equipment }: EquipmentFormProps) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Equipment Form</h2>
      <p className="text-muted-foreground">Form implementation pending</p>
      {equipment !== undefined && (
        <pre className="text-xs mt-2">Equipment data loaded</pre>
      )}
    </div>
  );
};
