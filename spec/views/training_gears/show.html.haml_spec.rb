require 'spec_helper'

describe "training_gears/show" do
  before(:each) do
    @training_gear = assign(:training_gear, stub_model(TrainingGear))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
