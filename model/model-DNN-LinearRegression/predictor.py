# ----- Import Packages -----
# Numerical Operations
import numpy as np

# PyTorch
import torch
import torch.nn as nn
from torch.utils.data import Dataset, DataLoader

# ----- Config -----
device = 'cuda' if torch.cuda.is_available() else 'cpu'
config = {
    'seed': 5201314,      # Your seed number, you can pick your lucky number. :)
    'select_all': False,   # Whether to use all features.
    'valid_ratio': 0.2,   # validation_size = train_size * valid_ratio
    'n_epochs': 3000,     # Number of epochs.            
    'batch_size': 256, 
    'learning_rate': 1e-5,              
    'early_stop': 400,    # If model has not improved for this many consecutive epochs, stop training.     
    'save_path': './models/model.ckpt'  # Your model will be saved here.
}

# ----- Some Utility Functions -----
def same_seed(seed): 
    '''Fixes random number generator seeds for reproducibility.'''
    torch.backends.cudnn.deterministic = True
    torch.backends.cudnn.benchmark = False
    np.random.seed(seed)
    torch.manual_seed(seed)
    if torch.cuda.is_available():
        torch.cuda.manual_seed_all(seed)

def predict(test_loader, model, device):
    model.eval() # Set your model to evaluation mode.
    preds = []
    for x in test_loader:
        x = x.to(device)                        
        with torch.no_grad():                   
            pred = model(x)                     
            preds.append(pred.detach().cpu())   
    preds = torch.cat(preds, dim=0).numpy()  
    return preds

# ----- Dataset -----
class PlanetsDataset(Dataset):
    # x: Features
    # y: Targets, if none, do prediction
    def __init__(self, x, y = None):
        self.x = torch.FloatTensor(x)
        if y is None:
            self.y = y
        else:
            self.y = torch.FloatTensor(y)
    
    def __getitem__(self, index):
        if self.y is None:
            return self.x[index]
        else:
            return self.x[index], self.y[index]
    
    def __len__(self):
        return len(self.x)

# ----- Neural Network Model -----
class My_Model(nn.Module):
    def __init__(self, input_dim):
        super(My_Model, self).__init__()
        # TODO: modify model's structure, be aware of dimensions
        # print("input_dim = " + str(input_dim))
        self.layers = nn.Sequential(
            nn.Linear(input_dim, 16),
            nn.ReLU(),
            nn.Linear(16, 8),
            nn.ReLU(),
            nn.Linear(8, 4),
            nn.ReLU(),
            nn.Linear(4, 1)
        )
    
    def forward(self, x):
        x = self.layers(x)
        x = x.squeeze(1) # (B, 1) -> B
        return x

# ----- API -----
def Predict8(input):

    # Set seed for reproducibility
    same_seed(config['seed'])

    if(len(input) != 8):
        print("FATAL ERROR: 输入数据不为8维！")

    x_test = np.asarray(input)
    x_test = x_test[np.newaxis, :]

    test_dataset = PlanetsDataset(x_test)

    test_loader = DataLoader(test_dataset, batch_size=1, shuffle=False, pin_memory=True)

    model = My_Model(input_dim=x_test.shape[1]).to(device)
    model.load_state_dict(torch.load(config['save_path']))
    preds = predict(test_loader, model, device) 

    for i, p in enumerate(preds):
        ans = p

    return ans

# input = [247.35373, 0.677, 2.19, 5.43, 0.62, 0.6, -0.57, 0.5923999]
input = [365, 1, 1, 100, 1, 1, 0, 1.0]
print(Predict8(input))