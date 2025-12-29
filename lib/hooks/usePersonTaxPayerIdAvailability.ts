import { useEffect, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserFormValues } from '@/app/settings/users/types';
import { isValiddocument } from '@/lib/validators';
import debounce from 'lodash.debounce';
import { checkDocumentAvailability } from '@/app/settings/users/availability/actions';
import { Role } from '@prisma/client';

const validateInput = (value: string, hasInteracted: boolean) => {
  if (!isValiddocument(value) && hasInteracted) {
    return { type: 'manual', message: 'Documento inválido' };
  }
  return null;
};

const checkAvailability = async (value: string, role: Role) => {
  const { available, message } = await checkDocumentAvailability(value, role);
  if (!available) {
    return { type: 'manual', message: message ?? 'Documento indisponível' };
  }
  return null;
};

const usePersondocumentAvailability = (
  methods: UseFormReturn<UserFormValues>
) => {
  const {
    watch,
    setError,
    clearErrors,
    formState: { touchedFields, dirtyFields }
  } = methods;
  const documentValue: string = watch('document') || '';
  const roleValue = watch('role');

  const validate = useCallback(
    debounce(async (val: string, role: Role) => {
      const hasInteracted = touchedFields.document || dirtyFields.document;
      if (!hasInteracted) return;

      const inputError = validateInput(val, hasInteracted);
      if (inputError) {
        setError('document', inputError);
        return;
      }

      try {
        const availabilityError = await checkAvailability(val, role);
        if (availabilityError) {
          setError('document', availabilityError);
        } else {
          clearErrors('document');
        }
      } catch {
        setError('document', {
          type: 'manual',
          message: 'Erro ao verificar disponibilidade'
        });
      }
    }, 500),
    [setError, clearErrors, touchedFields.document, dirtyFields.document]
  );

  useEffect(() => {
    validate(documentValue, roleValue);
    return () => validate.cancel();
  }, [documentValue, roleValue, validate]);
};

export default usePersondocumentAvailability;
