library(ggplot2)
library(dplyr)

data <- read.csv('process/csv/history.csv')


ggplot(data, aes(x=esv_rate, y=payers_rate, color=as.character(year))) +
  geom_point(alpha=.7)

