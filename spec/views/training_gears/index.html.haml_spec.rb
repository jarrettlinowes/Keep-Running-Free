require 'spec_helper'

describe "training_gears/index" do
  before(:each) do
    assign(:training_gears, [
      stub_model(TrainingGear),
      stub_model(TrainingGear)
    ])
  end

  it "renders a list of training_gears" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
