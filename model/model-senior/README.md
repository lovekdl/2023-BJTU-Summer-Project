# 行星宜居度预测专业版

## 1. 简介

### 1.1 内容介绍

这是一个行星宜居度预测的模型，支持使用356项关于行星的数据预测一颗行星是否宜居。数据越全预测结果越准确。

### 1.2 文件介绍

1. model文件夹：存放模型。包括预测模型，填充缺失值模型，标准化模型。
2. predict文件夹：包括需要预测的数据，清洗后的预测数据，和一份处理数据模版。
3. Exoplanets.ipynb：训练模型
4. predict.ipynb：预测demo
5. predict_data_clearify.ipynb：预测数据清洗
6. train_data_clearify.ipynb：训练数据清洗

## 2. 训练数据

### 2.1 数据来源

1. [The NASA exoplanet archive](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=planets)
2. [The Planetary Habitability Laboratory (PHL) optimistic and conservative samples of potentially habitable planets]( http://phl.upr.edu/projects/habitable-exoplanets-catalog/data/database)

### 2.2 数据预处理

1. 首先，并非简单地丢弃所有包含缺失数据的行，我们先移除了所有包含超过40%缺失数据的列。然后，使用R语言中的MICE库对数据集中的数值列进行插补，然后将结果保存到ImputedNumericalCols.csv文件中。

2. 具有超过10个唯一值的任何分类列都被移除，且缺失的分类数据被替换为字符串“Missing”。剩下的分类变量进行了独热编码。

3. 数据集中现在的缺失数据明显减少了。为了处理剩下的缺失数据：

   1. 在分类列中，用字符串 'missing' 填充缺失值
   2. 在数值列中，使用简单的插补器以 'median'（中位数）策略填充缺失数据

   然后，使用scikit-learn的Standard Scalar对数值数据进行了缩放，使每一列的方差达到单位方差，并去除了均值。

### 2.3 数据处理

这个行星数据集是不平衡的，即宜居样本（正样本）的数量远少于非宜居样本（负样本）。在拟合和评分模型时，这会造成问题。为了应对这个问题，我们使用了SMOTE过采样方法来人工增加正样本的数量。SMOTE代表"合成少数过采样技术"（Synthetic Minority Over-sampling Technique）。这是一种解决不平衡数据集问题的方法。它通过创建“合成”样本来增加少数类的数量。这些“合成”样本是从少数类样本中选择两个或者更多的相近样本，然后对它们的特征进行线性插值来创建的。通过这种方式，SMOTE可以在不改变原有类别分布的情况下，提高了少数类样本的数量，使得学习算法在训练时能更好地学习到少数类的特征，从而改善模型的性能。

可用的宜居行星的一半被分配到测试集，另一半被分配到训练集。行星被分配到哪个集合是随机确定的。然后，随机的行星被添加到测试集中，直到它包含了总共200个行星。此时，SMOTE过采样分别在训练集和测试集上使用（防止训练集被测试集的信息污染），从而得到最终的训练集和测试集。

## 3. 训练模型

我们测试了以下模型来训练

- Cat Boost 分类器
- 感知机
- KNN分类器
- 随机森林分类器
- 支持向量机分类器（SVC）
- XGBoost分类器

### 3.1 模型参数

上述模型的准确率会根据传递给它的数据准备时使用的随机种子的不同而略有差异，即被指定为测试集的宜居外星行星和被指定为测试集的宜居外星行星是哪些（因为宜居外星行星是随机分配的）。因此，对于上述每一个模型，我们使用5个不同的随机种子（42、52、62、72和82）准备的数据进行训练，并记录每个模型的平均和中位数准确度。

另外，保持数据不变，模型在5个不同的随机种子下进行训练，以检查模型是否依赖于随机种子。

通过测试我们发现全部模型都不依赖于随机种子。

### 3.2 训练模型

* 通过网格搜索来调整超参数。

* 为了评分模型，我们使用了scikit-learn的平衡精度得分（balanced accuracy score），以考虑到数据集的不平衡性。

### 3.3 训练结果

1) XGBoost:

* Mean Accuracy: 1.0
* Median Accuracy: 1.0
* Standard Deviation: 0.02040525583125309

2. K-Neighbours Classifier:

* Mean Accuracy: 0.7488636363636364
* Median Accuracy: 0.7471590909090909
* Standard Deviation: 0.020767803275564836 

3. Perceptron:

* Mean Accuracy: 0.8454545454545455
* Median Accuracy: 0.8494318181818182
* Standard Deviation: 0.013397529684717729

4. SVC:

* Mean Accuracy: 0.8357954545454545
* Median Accuracy: 0.84375
* Standard Deviation: 0.009742288749705827

5. Random Forest Classifier:

* Mean Accuracy: 0.8897727272727274
* Median Accuracy: 0.9005681818181818
* Standard Deviation: 0.05995327898586553

6) Cat Boost:
* Mean Accuracy: 0.9448863636363637
* Median Accuracy: 0.9545454545454546
* Standard Deviation: 0.03805545920372808

最中我们选择了XGBoost模型。以下是ChatGPT4.0对XGBoost的介绍：

XGBoost 是一种用于监督学习问题的决策树增强算法，名字代表 "Extreme Gradient Boosting"（极端梯度提升）。这是一种实现了梯度提升决策树算法的高效和灵活的开源库。XGBoost在许多机器学习竞赛中都取得了非常好的成绩，因为它能够有效地处理各种类型的数据和预测问题，并且提供了丰富的模型解释性。

XGBoost使用了一种称为梯度提升（Gradient Boosting）的技术，该技术基于的观念是：创建并结合一系列的"弱模型"（在此上下文中，通常是指决策树）来生成一个强大的集成模型。在每个提升的阶段，模型都会尝试找到并纠正其前任中的错误，从而提升整体预测的准确性。

XGBoost的一些重要特性包括：

- **正则化**：XGBoost在模型训练过程中引入了正则化因子来防止过拟合，这使其比传统的梯度提升更为稳健。
- **并行处理**：XGBoost采用并行计算，这在处理大型数据集时会显著提高速度。
- **灵活性**：XGBoost允许用户自定义优化目标和评估标准，这使得它可以用于广泛的应用领域。
- **处理缺失值**：XGBoost可以自动学习和处理数据中的缺失值。
- **内置交叉验证**：XGBoost允许用户在每个提升的迭代中运行交叉验证，从而可以方便地跟踪模型性能。
- **剪枝**：XGBoost以贪心算法进行分裂查找，并且包括剪枝，与GBM不同，GBM会停止分裂一旦它遇到一个负损失。

这些特性使得XGBoost在许多机器学习任务中成为优选的模型，包括分类，回归，和排序问题等等。

## 4. 如何使用

### 4.1. 预测所需要的数据（可缺省）

356列数据中的任何多项数据，数据越全准确率越高

### 4.2 预测过程

1. 加载模型
2. 将所需要预测的数据进行预处理
3. 输出预测结果，1为可宜居星球，0为不可宜居星球