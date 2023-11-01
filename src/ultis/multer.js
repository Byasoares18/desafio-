import multer from 'multer';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './src/public/images'); // Diretório de destino para os arquivos enviados
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Usa o nome original do arquivo
  }
});

const fileFilter = (req, file, cb) => {
  // Adicione sua lógica de validação de arquivos aqui, por exemplo, permitindo apenas arquivos de imagem
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Aceita o arquivo
  } else {
    cb(null, false); // Rejeita o arquivo
  }
};

export const uploader = multer({ storage, fileFilter });