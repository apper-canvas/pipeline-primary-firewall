import React from "react";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ title, value, change, changeType, icon, color = "primary" }) => {
  const colorClasses = {
    primary: "text-primary bg-blue-50",
    success: "text-success bg-green-50",
    warning: "text-warning bg-yellow-50",
    error: "text-error bg-red-50",
  };

  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-secondary",
  };

  return (
    <Card className="card-hover">
      <Card.Content className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-secondary mb-1">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {change && (
                <span className={`ml-2 text-sm font-medium ${changeColors[changeType] || changeColors.neutral}`}>
                  {change}
                </span>
              )}
            </div>
          </div>
          {icon && (
            <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
              <ApperIcon name={icon} className="h-6 w-6" />
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};

export default StatCard;