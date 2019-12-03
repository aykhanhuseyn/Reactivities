using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
  public class Create
  {
    public class Command : IRequest
    {
      public Guid Id { get; set; }
      public string Title { get; set; }
      public string Description { get; set; }
      public string Category { get; set; }
      public DateTime Date { get; set; }
      public string City { get; set; }
      public string Venue { get; set; }
    }

    public class Handler : IRequestHandler<Command>
    {
      private readonly DataContext _context;
      private readonly ILogger _logger;
      public Handler(DataContext context, ILogger<Activity> logger)
      {
        _logger = logger;
        _context = context;
      }

      public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
      {
        try
        {
          cancellationToken.ThrowIfCancellationRequested();
        }
        catch (System.Exception ex)
        {
          if (ex is TaskCanceledException)
          {
            _logger.LogInformation("Activity creating process cancelled.");
            throw;
          }
          _logger.LogInformation(ex.Message);
          throw;
        }
        var activity = new Activity
        {
          Id = request.Id,
          Title = request.Title,
          Description = request.Description,
          Category = request.Category,
          Date = request.Date,
          City = request.City,
          Venue = request.Venue
        };
        _context.Activities.Add(activity);
        var success = await _context.SaveChangesAsync() > 0;

        if (success)
        {
          return Unit.Value;
        }
        else
        {
          _logger.LogInformation("Problem in saving changes.");
          throw new Exception("Problem in saving changes.");
        }
      }
    }
  }
}