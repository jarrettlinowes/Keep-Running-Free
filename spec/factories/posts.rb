# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :post do
    title "MyString"
    intro "MyText"
    body "MyText"
    status "MyString"
    author_id 1
  end
end
