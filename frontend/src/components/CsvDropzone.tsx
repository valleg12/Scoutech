import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import Papa from 'papaparse';

interface CsvDropzoneProps {
  onCsvLoaded: (data: any[], headers: string[]) => void;
  onError?: (message: string) => void;
}

interface CsvRow {
  [key: string]: string;
}

const CsvDropzone: React.FC<CsvDropzoneProps> = ({ onCsvLoaded, onError }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (!file.name.endsWith('.csv')) {
        setError('Veuillez sélectionner un fichier CSV');
        onError?.('Veuillez sélectionner un fichier CSV');
        return;
      }

      setLoading(true);
      setError(null);
      setFileName(file.name);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            setError('Erreur lors de la lecture du fichier CSV');
            onError?.('Erreur lors de la lecture du fichier CSV');
            return;
          }

          const headers = results.meta.fields || [];
          onCsvLoaded(results.data, headers);
          setSuccess(true);
          setLoading(false);
        },
        error: () => {
          setError('Erreur lors de la lecture du fichier CSV');
          onError?.('Erreur lors de la lecture du fichier CSV');
          setLoading(false);
        },
      });
    },
    [onCsvLoaded, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  const resetDropzone = () => {
    setSuccess(false);
    setFileName(null);
    setError(null);
  };

  return (
    <Paper
      sx={{
        p: 3,
        backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
        transition: 'background-color 0.3s ease',
      }}
    >
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: error ? 'error.main' : success ? 'success.main' : 'primary.main',
          borderRadius: 1,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          position: 'relative',
        }}
      >
        <input {...getInputProps()} />
        {loading ? (
          <CircularProgress />
        ) : success ? (
          <Box>
            <CheckCircleIcon color="success" sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="body1" gutterBottom>
              {fileName} chargé avec succès
            </Typography>
            <Tooltip title="Supprimer le fichier">
              <IconButton onClick={resetDropzone} size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 40, mb: 1, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              {isDragActive
                ? 'Déposez le fichier ici'
                : 'Glissez et déposez votre fichier CSV ici'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              ou cliquez pour sélectionner un fichier
            </Typography>
          </>
        )}
      </Box>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Paper>
  );
};

export default CsvDropzone; 